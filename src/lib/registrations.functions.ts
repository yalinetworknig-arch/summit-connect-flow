import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { fullRegistrationSchema } from "@/lib/register/schema";
import { sendTicketEmail } from "@/lib/email/ticket-email.server";

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((input) => fullRegistrationSchema.parse(input))
  .handler(async ({ data }) => {
    const payload = {
      ...data,
      yali_id: data.yali_id?.trim() || null,
      yali_certificate_url: data.yali_certificate_url?.trim() || null,
      dietary_restrictions: data.dietary_restrictions?.trim() || null,
      heard_about_summit: data.heard_about_summit?.trim() || null,
      paystack_reference: data.paystack_reference || null,
    };
    const { data: row, error } = await supabaseAdmin
      .from("registrations")
      .insert(payload)
      .select("id, full_name, email, ticket_code, track_selection, attendee_type, created_at, payment_status, amount_kobo")
      .single();
    if (error) throw new Error(error.message);
    if (row?.email) {
      const result = await sendTicketEmail({
        to: row.email,
        fullName: row.full_name,
        ticketCode: row.ticket_code,
        track: row.track_selection,
        attendeeType: row.attendee_type,
      });
      if (!result.ok) console.error("ticket email failed:", result.error);
    }
    return row;
  });

export const getRegistrationById = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("registrations")
      .select("id, full_name, email, ticket_code, track_selection, attendee_type, created_at, payment_status, amount_kobo")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Registration not found");
    return row;
  });