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
  profile: {
    headline: string | null;
    bio: string | null;
    linkedin_url: string | null;
    avatar_url: string | null;
  } | null;
};

export const getAttendeeCard = createServerFn({ method: "POST" })
  .inputValidator((input) => codeSchema.parse(input))
  .handler(async ({ data }): Promise<AttendeeCard> => {
    const supabase = createServerSupabase();

    const { data: reg, error } = await supabase
      .from("registrations")
      .select("id, ticket_code, full_name, attendee_type, track_selection, state, checked_in_at")
      .eq("ticket_code", data.code)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!reg) throw new Error("Attendee not found");

    let profile: AttendeeCard["profile"] = null;
    const { data: prof } = await supabase
      .from("attendee_profiles")
      .select("headline, bio, linkedin_url, avatar_url, networking_opt_in")
      .eq("registration_id", reg.id)
      .maybeSingle();
    if (prof && prof.networking_opt_in) {
      profile = {
        headline: prof.headline,
        bio: prof.bio,
        linkedin_url: prof.linkedin_url,
        avatar_url: prof.avatar_url,
      };
    }

    await logScanEvent(supabase, reg.ticket_code, "profile_view");

    return {
      ticket_code: reg.ticket_code,
      full_name: reg.full_name,
      attendee_type: reg.attendee_type,
      track_selection: reg.track_selection,
      state: reg.state,
      checked_in: Boolean(reg.checked_in_at),
      profile,
    };
  });

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
