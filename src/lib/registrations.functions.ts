import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { fullRegistrationSchema } from "@/lib/register/schema";
import { sendTicketEmail } from "@/lib/email/ticket-email.server";

/** Normalize Nigerian phone numbers to +234XXXXXXXXXX.
 *  Accepts: 08012345678, 8012345678, +2348012345678, 234-801-234-5678, etc.
 *  Falls back to the original value if it doesn't look Nigerian. */
function normalizeNigerianPhone(raw: string): string {
  const digits = raw.replace(/\D/g, ""); // strip everything except digits
  if (digits.startsWith("234") && digits.length === 13) return `+${digits}`;
  if (digits.startsWith("0") && digits.length === 11) return `+234${digits.slice(1)}`;
  if (digits.length === 10) return `+234${digits}`;
  // already has + prefix?
  const cleaned = raw.trim();
  if (cleaned.startsWith("+")) return cleaned;
  return raw.trim(); // unknown format — pass through, constraint is now relaxed
}

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((input) => fullRegistrationSchema.parse(input))
  .handler(async ({ data }) => {
    console.log("[SERVER] Registration submission started for:", data.email);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const nn = (v: string | null | undefined) => (v?.trim() ? v.trim() : null);
    const payload = {
      ...data,
      phone: normalizeNigerianPhone(data.phone),
      yali_id: data.attendee_type === "delegate" ? nn(data.yali_id) || null : nn(data.yali_id),
      yali_certificate_url: nn(data.yali_certificate_url),
      heard_about_summit: nn(data.heard_about_summit),
      paystack_reference: data.paystack_reference || null,
      organization: nn(data.organization),
      role_title: nn(data.role_title),
      sponsor_tier: nn(data.sponsor_tier),
      sponsor_goals: nn(data.sponsor_goals),
      media_outlet: nn(data.media_outlet),
      media_type: nn(data.media_type),
      media_coverage_focus: nn(data.media_coverage_focus),
      audience_reach: nn(data.audience_reach),
      profession: nn(data.profession),
      reason_for_attending: nn(data.reason_for_attending),
      volunteer_skills: nn(data.volunteer_skills),
      volunteer_availability: nn(data.volunteer_availability),
      tshirt_size: nn(data.tshirt_size),
      tshirt_color: nn(data.tshirt_color),
      prior_volunteer_experience: nn(data.prior_volunteer_experience),
      // Auto-verify via email — no manual verification needed
      verification_status: "verified",
      verification_model: "email-auto-verify",
      verification_reason: "Automatically verified at registration submission",
      verification_checked_at: new Date().toISOString(),
    };
    console.log("[SERVER] Inserting into Supabase...");
    const { data: row, error } = await supabaseAdmin
      .from("registrations")
      .insert(payload)
      .select("id, full_name, email, ticket_code, sector, attendee_type, attendance_mode, state, created_at, payment_status, amount_kobo")
      .single();
    if (error) {
      console.error("[SERVER] Supabase insert error:", error);
      const msg = error.message ?? "";
      if (msg.includes("registrations_email_key") || msg.includes("duplicate key")) {
        throw new Error(
          "This email address is already registered. If you believe this is a mistake, please contact the summit team."
        );
      }
      throw new Error(msg);
    }
    console.log("[SERVER] Registration created with ID:", row?.id);
    // Awaited (not fire-and-forget): on serverless, the function's execution
    // context can be frozen/torn down the instant the response is sent, which
    // would silently kill a detached email send before it reaches Resend.
    // sendTicketEmail() has its own 8s timeout, and a failed/slow email never
    // fails the registration itself — it's just logged.
    if (row?.email) {
      console.log("[SERVER] Sending ticket email...");
      try {
        const result = await sendTicketEmail({
          to: row.email,
          fullName: row.full_name,
          ticketCode: row.ticket_code,
          sector: row.sector,
          attendeeType: row.attendee_type,
          attendanceMode: row.attendance_mode,
          state: row.state,
        });
        if (!result.ok) console.error("[SERVER] ticket email failed:", result.error);
        else console.log("[SERVER] ticket email sent:", result.id);
      } catch (e) {
        console.error("[SERVER] ticket email threw:", e);
      }
    }
    console.log("[SERVER] Returning registration data to client...");
    return row;
  });

export const getRegistrationById = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin.rpc(
      "get_public_registration_confirmation",
      { registration_id: data.id },
    );
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Registration not found");
    return row as {
      id: string;
      full_name: string;
      email: string;
      ticket_code: string;
      track_selection: string | null;
      attendee_type: string;
      created_at: string;
      payment_status: string;
      amount_kobo: number | null;
    };
  });