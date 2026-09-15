import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

// Untyped client: attendee_connections / scan_events aren't in the generated
// Database types yet, and splicing them in breaks embedded-select inference.
function createServerSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Ticket codes are UUIDs; the strict charset also keeps codes safe to embed
// in PostgREST .or() filter expressions.
const ticketCode = z.string().trim().min(4).max(64).regex(/^[A-Za-z0-9-]+$/, "Invalid ticket code");
const codeSchema = z.object({ code: ticketCode });

async function logScanEvent(
  supabase: ReturnType<typeof createServerSupabase>,
  ticketCode: string,
  eventType: string,
  metadata: Record<string, unknown> = {},
) {
  // Best-effort analytics; never block the user flow on this insert.
  await supabase
    .from("scan_events")
    .insert({ ticket_code: ticketCode, event_type: eventType, metadata })
    .then(({ error }) => {
      if (error) console.error("scan_events insert failed:", error.message);
    });
}

export type AttendeeCard = {
  ticket_code: string;
  full_name: string;
  attendee_type: string;
  track_selection: string | null;
  state: string | null;
  checked_in: boolean;
  networking_opt_in: boolean;
  profile: {
    headline: string | null;
    bio: string | null;
    linkedin_url: string | null;
    avatar_url: string | null;
  } | null;
};

const getCardSchema = z.object({ code: ticketCode, viewerCode: ticketCode.optional() });

export const getAttendeeCard = createServerFn({ method: "POST" })
  .inputValidator((input) => getCardSchema.parse(input))
  .handler(async ({ data }): Promise<AttendeeCard> => {
    const supabase = createServerSupabase();

    const { data: reg, error } = await supabase
      .from("registrations")
      .select("id, ticket_code, full_name, attendee_type, track_selection, state, checked_in_at")
      .eq("ticket_code", data.code)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!reg) throw new Error("Attendee not found");

    // The card owner can always see (and therefore edit) their own bio/headline/
    // LinkedIn/avatar, even while networking_opt_in is off — opt-in only hides
    // that data from OTHER viewers, it never hides it from the owner.
    const isOwner = Boolean(data.viewerCode) && data.viewerCode === reg.ticket_code;

    let profile: AttendeeCard["profile"] = null;
    const { data: prof } = await supabase
      .from("attendee_profiles")
      .select("headline, bio, linkedin_url, avatar_url, networking_opt_in")
      .eq("registration_id", reg.id)
      .maybeSingle();
    if (prof && (prof.networking_opt_in || isOwner)) {
      profile = {
        headline: prof.headline,
        bio: prof.bio,
        linkedin_url: prof.linkedin_url,
        avatar_url: prof.avatar_url,
      };
    }

    if (!isOwner) {
      await logScanEvent(supabase, reg.ticket_code, "profile_view");
    }

    return {
      ticket_code: reg.ticket_code,
      full_name: reg.full_name,
      attendee_type: reg.attendee_type,
      track_selection: reg.track_selection,
      state: reg.state,
      checked_in: Boolean(reg.checked_in_at),
      networking_opt_in: prof?.networking_opt_in ?? true,
      profile,
    };
  });

const updateCardSchema = z.object({
  code: ticketCode,
  headline: z.string().trim().max(160).optional().nullable(),
  bio: z.string().trim().max(800).optional().nullable(),
  linkedin_url: z
    .string()
    .trim()
    .max(300)
    .regex(/^https?:\/\/(www\.)?linkedin\.com\/.+/i, "Must be a linkedin.com URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  avatar_url: z.string().trim().url("Must be a valid URL").max(500).optional().nullable().or(z.literal("")),
  networking_opt_in: z.boolean().optional(),
});

/**
 * Passwordless self-service profile edit. Authorization is the ticket code
 * itself — the same trust model saveContact() already uses. Nobody sees a
 * registrant's ticket code except that registrant (their confirmation email
 * and their own ticket/networking-card page), so presenting it back is
 * equivalent to a magic-link token, with no password anywhere.
 */
export const updateMyAttendeeCard = createServerFn({ method: "POST" })
  .inputValidator((input) => updateCardSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = createServerSupabase();

    const { data: reg, error: regErr } = await supabase
      .from("registrations")
      .select("id, ticket_code")
      .eq("ticket_code", data.code)
      .maybeSingle();
    if (regErr) throw new Error(regErr.message);
    if (!reg) throw new Error("Ticket not found. Check the code on your ticket page.");

    const patch: Record<string, unknown> = { registration_id: reg.id };
    if (data.headline !== undefined) patch.headline = data.headline?.trim() || null;
    if (data.bio !== undefined) patch.bio = data.bio?.trim() || null;
    if (data.linkedin_url !== undefined) patch.linkedin_url = data.linkedin_url || null;
    if (data.avatar_url !== undefined) patch.avatar_url = data.avatar_url || null;
    if (data.networking_opt_in !== undefined) patch.networking_opt_in = data.networking_opt_in;

    const { error: upErr } = await supabase
      .from("attendee_profiles")
      .upsert(patch, { onConflict: "registration_id" });
    if (upErr) throw new Error(upErr.message);

    return { ok: true };
  });

export type DirectoryPerson = {
  ticket_code: string;
  full_name: string;
  attendee_type: string;
  state: string | null;
  track_selection: string | null;
  headline: string | null;
  bio: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
};

/**
 * Public, passwordless attendee directory. Gate is networking_opt_in only —
 * no login, no check-in requirement. Anyone with the link can browse and
 * jump to a person's /attendee/$code card to connect (via saveContact),
 * exactly the same flow as scanning their QR in person.
 */
export const listNetworkDirectory = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ people: DirectoryPerson[] }> => {
    const supabase = createServerSupabase();

    const { data: profiles, error } = await supabase
      .from("attendee_profiles")
      .select("registration_id, headline, bio, linkedin_url, avatar_url")
      .eq("networking_opt_in", true)
      .not("registration_id", "is", null);
    if (error) throw new Error(error.message);

    const regIds = (profiles ?? [])
      .map((p) => p.registration_id as string | null)
      .filter((id): id is string => Boolean(id));
    if (regIds.length === 0) return { people: [] };

    const { data: regs, error: regErr } = await supabase
      .from("registrations")
      .select("id, ticket_code, full_name, attendee_type, state, track_selection")
      .in("id", regIds);
    if (regErr) throw new Error(regErr.message);

    const regMap = new Map((regs ?? []).map((r) => [r.id as string, r]));
    const people: DirectoryPerson[] = (profiles ?? [])
      .map((p) => {
        const r = regMap.get(p.registration_id as string);
        if (!r) return null;
        return {
          ticket_code: r.ticket_code as string,
          full_name: r.full_name as string,
          attendee_type: r.attendee_type as string,
          state: (r.state as string | null) ?? null,
          track_selection: (r.track_selection as string | null) ?? null,
          headline: p.headline as string | null,
          bio: p.bio as string | null,
          linkedin_url: p.linkedin_url as string | null,
          avatar_url: p.avatar_url as string | null,
        } satisfies DirectoryPerson;
      })
      .filter((p): p is DirectoryPerson => p !== null);

    return { people };
  },
);

const saveContactSchema = z.object({
  fromCode: ticketCode,
  toCode: ticketCode,
});

export const saveContact = createServerFn({ method: "POST" })
  .inputValidator((input) => saveContactSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.fromCode === data.toCode) {
      throw new Error("You can't save your own contact");
    }
    const supabase = createServerSupabase();

    const { data: regs, error: regErr } = await supabase
      .from("registrations")
      .select("ticket_code, full_name")
      .in("ticket_code", [data.fromCode, data.toCode]);
    if (regErr) throw new Error(regErr.message);

    const from = regs?.find((r) => r.ticket_code === data.fromCode);
    const to = regs?.find((r) => r.ticket_code === data.toCode);
    if (!from) throw new Error("Your ticket code wasn't found. Check it on your ticket page.");
    if (!to) throw new Error("Attendee not found");

    const { error: insErr } = await supabase.from("attendee_connections").insert({
      from_ticket_code: data.fromCode,
      to_ticket_code: data.toCode,
      scanned_at: new Date().toISOString(),
    });

    if (insErr) {
      // 23505 = unique_violation → already connected, treat as success
      if (insErr.code === "23505") {
        return { alreadyConnected: true, contactName: to.full_name };
      }
      throw new Error(insErr.message);
    }

    await logScanEvent(supabase, data.toCode, "connection_saved", { from: data.fromCode });

    return { alreadyConnected: false, contactName: to.full_name };
  });

export type ConnectionEntry = {
  ticket_code: string;
  full_name: string;
  attendee_type: string;
  state: string | null;
  connected_at: string | null;
};

export const getMyConnections = createServerFn({ method: "POST" })
  .inputValidator((input) => codeSchema.parse(input))
  .handler(async ({ data }): Promise<{ connections: ConnectionEntry[] }> => {
    const supabase = createServerSupabase();

    // Verify the code is real before returning anything.
    const { data: me, error: meErr } = await supabase
      .from("registrations")
      .select("ticket_code")
      .eq("ticket_code", data.code)
      .maybeSingle();
    if (meErr) throw new Error(meErr.message);
    if (!me) throw new Error("Ticket not found");

    const { data: rows, error } = await supabase
      .from("attendee_connections")
      .select("from_ticket_code, to_ticket_code, scanned_at, created_at")
      .or(`from_ticket_code.eq.${data.code},to_ticket_code.eq.${data.code}`)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);

    const otherCodes = Array.from(
      new Set(
        (rows ?? []).map((r) =>
          r.from_ticket_code === data.code ? r.to_ticket_code : r.from_ticket_code,
        ),
      ),
    ).filter(Boolean) as string[];

    if (otherCodes.length === 0) return { connections: [] };

    const { data: people, error: pplErr } = await supabase
      .from("registrations")
      .select("ticket_code, full_name, attendee_type, state")
      .in("ticket_code", otherCodes);
    if (pplErr) throw new Error(pplErr.message);

    const byCode = new Map((people ?? []).map((p) => [p.ticket_code, p]));
    const seen = new Set<string>();
    const connections: ConnectionEntry[] = [];
    for (const r of rows ?? []) {
      const other = r.from_ticket_code === data.code ? r.to_ticket_code : r.from_ticket_code;
      if (!other || seen.has(other)) continue;
      seen.add(other);
      const p = byCode.get(other);
      if (!p) continue;
      connections.push({
        ticket_code: p.ticket_code,
        full_name: p.full_name,
        attendee_type: p.attendee_type,
        state: p.state,
        connected_at: r.scanned_at ?? r.created_at,
      });
    }

    return { connections };
  });
