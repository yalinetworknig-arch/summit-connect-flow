import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { sendConnectionsDigestEmail, type ContactEntry } from "@/lib/email/connections-email.server";

// Untyped client: attendee_connections / scan_events aren't in the generated
// Database types (see networking.functions.ts).
function createServerSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function assertAdmin(supabase: ReturnType<typeof createServerSupabase>, userId: string) {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r: any) => r.role) as string[];
  if (!roles.includes("admin")) throw new Error("Forbidden: requires admin role");
}

export type NetworkingStats = {
  totalConnections: number;
  pendingEmails: number;
  sentEmails: number;
  profileViews: number;
};

export const getNetworkingStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<NetworkingStats> => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    await assertAdmin(supabase, userId);

    const [total, pending, sent, views] = await Promise.all([
      supabase.from("attendee_connections").select("id", { count: "exact", head: true }),
      supabase.from("attendee_connections").select("id", { count: "exact", head: true }).is("email_sent_at", null),
      supabase.from("attendee_connections").select("id", { count: "exact", head: true }).not("email_sent_at", "is", null),
      supabase.from("scan_events").select("id", { count: "exact", head: true }).eq("event_type", "profile_view"),
    ]);
    for (const r of [total, pending, sent, views]) {
      if (r.error) throw new Error(r.error.message);
    }
    return {
      totalConnections: total.count ?? 0,
      pendingEmails: pending.count ?? 0,
      sentEmails: sent.count ?? 0,
      profileViews: views.count ?? 0,
    };
  });

const sendInput = z.object({
  dryRun: z.boolean().default(true),
  // Cap recipients per invocation so we stay inside the 60s serverless timeout
  // (each send is ~1.6s incl. Resend rate-limit spacing); the admin clicks
  // again to drain the rest.
  maxRecipients: z.number().int().min(1).max(100).default(25),
});

export type SendConnectionEmailsResult = {
  dryRun: boolean;
  pendingConnections: number;
  recipientsPlanned: number;
  emailsSent: number;
  emailsFailed: number;
  connectionsMarked: number;
  remainingRecipients: number;
  errors: string[];
};

export const sendConnectionEmails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => sendInput.parse(input ?? {}))
  .handler(async ({ data, context }): Promise<SendConnectionEmailsResult> => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    await assertAdmin(supabase, userId);

    const { data: rows, error } = await supabase
      .from("attendee_connections")
      .select("id, from_ticket_code, to_ticket_code")
      .is("email_sent_at", null)
      .order("created_at", { ascending: true })
      .limit(2000);
    if (error) throw new Error(error.message);

    const pending = rows ?? [];
    if (pending.length === 0) {
      return {
        dryRun: data.dryRun,
        pendingConnections: 0,
        recipientsPlanned: 0,
        emailsSent: 0,
        emailsFailed: 0,
        connectionsMarked: 0,
        remainingRecipients: 0,
        errors: [],
      };
    }

    // recipient ticket code → set of contact ticket codes (both directions)
    const recipientContacts = new Map<string, Set<string>>();
    const addPair = (recipient: string, contact: string) => {
      if (!recipientContacts.has(recipient)) recipientContacts.set(recipient, new Set());
      recipientContacts.get(recipient)!.add(contact);
    };
    for (const r of pending) {
      if (!r.from_ticket_code || !r.to_ticket_code) continue;
      addPair(r.from_ticket_code, r.to_ticket_code);
      addPair(r.to_ticket_code, r.from_ticket_code);
    }

    const allCodes = Array.from(recipientContacts.keys());
    const { data: regs, error: regErr } = await supabase
      .from("registrations")
      .select("id, ticket_code, full_name, email, phone, attendee_type, state")
      .in("ticket_code", allCodes);
    if (regErr) throw new Error(regErr.message);
    const regByCode = new Map((regs ?? []).map((r) => [r.ticket_code, r]));

    const regIds = (regs ?? []).map((r) => r.id);
    const { data: profiles } = await supabase
      .from("attendee_profiles")
      .select("registration_id, linkedin_url, networking_opt_in")
      .in("registration_id", regIds);
    const linkedinByRegId = new Map(
      (profiles ?? [])
        .filter((p: any) => p.networking_opt_in && p.linkedin_url)
        .map((p: any) => [p.registration_id, p.linkedin_url as string]),
    );

    const recipients = Array.from(recipientContacts.keys()).filter((code) => regByCode.has(code));
    const batch = recipients.slice(0, data.maxRecipients);

    if (data.dryRun) {
      return {
        dryRun: true,
        pendingConnections: pending.length,
        recipientsPlanned: batch.length,
        emailsSent: 0,
        emailsFailed: 0,
        connectionsMarked: 0,
        remainingRecipients: Math.max(0, recipients.length - batch.length),
        errors: [],
      };
    }

    const succeeded = new Set<string>();
    const errors: string[] = [];
    for (const code of batch) {
      const me = regByCode.get(code)!;
      const contacts: ContactEntry[] = Array.from(recipientContacts.get(code)!)
        .map((c) => regByCode.get(c))
        .filter((r): r is NonNullable<typeof r> => Boolean(r))
        .map((r) => ({
          full_name: r.full_name,
          email: r.email,
          phone: r.phone,
          attendee_type: r.attendee_type,
          state: r.state,
          linkedin_url: linkedinByRegId.get(r.id) ?? null,
        }));
      if (contacts.length === 0) continue;

      const result = await sendConnectionsDigestEmail({ to: me.email, fullName: me.full_name, contacts });
      if (result.ok) {
        succeeded.add(code);
      } else {
        errors.push(`${me.email}: ${result.error}`);
      }
      // Resend free tier allows ~2 requests/second
      await new Promise((r) => setTimeout(r, 600));
    }

    // A connection is delivered only once BOTH sides received their digest.
    const deliveredIds = pending
      .filter((r) => succeeded.has(r.from_ticket_code) && succeeded.has(r.to_ticket_code))
      .map((r) => r.id);

    let marked = 0;
    if (deliveredIds.length > 0) {
      const { error: updErr } = await supabase
        .from("attendee_connections")
        .update({ email_sent_at: new Date().toISOString() })
        .in("id", deliveredIds);
      if (updErr) {
        errors.push(`marking sent: ${updErr.message}`);
      } else {
        marked = deliveredIds.length;
      }
    }

    return {
      dryRun: false,
      pendingConnections: pending.length,
      recipientsPlanned: batch.length,
      emailsSent: succeeded.size,
      emailsFailed: batch.length - succeeded.size,
      connectionsMarked: marked,
      remainingRecipients: Math.max(0, recipients.length - batch.length),
      errors: errors.slice(0, 10),
    };
  });
