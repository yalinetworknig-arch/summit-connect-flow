import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { supabase as publicSupabase } from "@/integrations/supabase/client";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { sendTicketEmail } from "@/lib/email/ticket-email.server";

function createServerSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const codeSchema = z.object({ code: z.string().trim().min(4).max(64) });

export type PublicTicket = {
  id: string;
  ticket_code: string;
  full_name: string;
  attendee_type: string;
  track_selection: string | null;
  verification_status: string;
  checked_in_at: string | null;
  created_at: string;
};

export const getTicketByCode = createServerFn({ method: "POST" })
  .inputValidator((input) => codeSchema.parse(input))
  .handler(async ({ data }): Promise<PublicTicket> => {
    const { data: row, error } = await publicSupabase.rpc(
      "get_public_ticket_by_code",
      { ticket_code_input: data.code },
    );
    if (error) throw new Error(error.message);
    if (!row) throw new Error("Ticket not found");
    return row as PublicTicket;
  });

async function getUserRoles(supabase: any, userId: string) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r: any) => r.role) as string[];
}

function assertHasStaffRole(roles: string[]) {
  if (!roles.includes("admin") && !roles.includes("staff")) {
    throw new Error("Forbidden: requires admin or staff role");
  }
}

function assertHasAdminRole(roles: string[]) {
  if (!roles.includes("admin")) {
    throw new Error("Forbidden: requires admin role");
  }
}

export const getMyRoles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { roles: (data ?? []).map((r: any) => r.role) as string[] };
  });

export const checkInTicket = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => codeSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasStaffRole(roles);

    const { data: existing, error: e1 } = await supabase
      .from("registrations")
      .select("id, full_name, attendee_type, track_selection, verification_status, checked_in_at")
      .eq("ticket_code", data.code)
      .maybeSingle();
    if (e1) throw new Error(e1.message);
    if (!existing) throw new Error("Ticket not found");

    if (existing.checked_in_at) {
      return { alreadyCheckedIn: true, registration: existing };
    }

    const { data: updated, error: e2 } = await supabase
      .from("registrations")
      .update({ checked_in_at: new Date().toISOString(), checked_in_by: userId })
      .eq("id", existing.id)
      .select("id, full_name, attendee_type, track_selection, verification_status, checked_in_at")
      .single();
    if (e2) throw new Error(e2.message);
    return { alreadyCheckedIn: false, registration: updated };
  });

const listInput = z.object({
  verification: z.enum(["all", "pending", "verified", "suspicious", "rejected", "error"]).optional(),
  checkedIn: z.enum(["all", "yes", "no"]).optional(),
  attendeeType: z.enum(["delegate", "sponsor", "media", "public", "volunteer"]).optional(),
  search: z.string().trim().max(120).optional(),
});

export const listRegistrations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => listInput.parse(input ?? {}))
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasStaffRole(roles);

    let q = supabase
      .from("registrations")
      .select(
        "id, ticket_code, full_name, email, phone, attendee_type, track_selection, verification_status, verification_reason, yali_id, yali_certificate_url, checked_in_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (data.verification && data.verification !== "all") {
      q = q.eq("verification_status", data.verification);
    }
    if (data.checkedIn === "yes") q = q.not("checked_in_at", "is", null);
    if (data.checkedIn === "no") q = q.is("checked_in_at", null);
    if (data.attendeeType) {
      q = q.eq("attendee_type", data.attendeeType);
    }
    if (data.search) {
      const s = data.search.replace(/[%,]/g, " ");
      q = q.or(`full_name.ilike.%${s}%,email.ilike.%${s}%,ticket_code.ilike.%${s}%`);
    }

    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return { rows: rows ?? [] };
  });

export const exportRegistrationsCSV = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ mode: z.enum(["all", "physical", "virtual"]).optional() }).parse(input ?? {}))
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasStaffRole(roles);

    let q = supabase
      .from("registrations")
      .select("id, ticket_code, full_name, email, phone, attendee_type, track_selection, attendance_mode")
      .order("created_at", { ascending: false });

    // Filter by attendance mode if specified
    if (data.mode && data.mode !== "all") {
      q = q.eq("attendance_mode", data.mode);
    }

    const { data: rows, error } = await q;

    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) return { csv: "" };

    // Build CSV with headers
    const headers = ["Full Name", "Email", "Ticket Code", "Phone", "Attendee Type", "Sector", "Attendance Mode"];
    const csvRows = rows.map((r: any) => [
      `"${(r.full_name || "").replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      r.ticket_code || "",
      r.phone || "",
      r.attendee_type || "",
      r.track_selection || "",
      r.attendance_mode || "",
    ]);

    const csv = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");
    return { csv, count: rows.length };
  });

export const overrideVerification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "verified", "suspicious", "rejected", "error"]),
        reason: z.string().trim().max(500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasAdminRole(roles);
    const { error } = await supabase
      .from("registrations")
      .update({
        verification_status: data.status,
        verification_reason: data.reason ?? `Manually set by admin to ${data.status}`,
        verification_checked_at: new Date().toISOString(),
        verification_model: "admin-override",
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteRegistration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasAdminRole(roles);

    // Get registration details before deletion for logging
    const { data: reg } = await supabase
      .from("registrations")
      .select("id, full_name, email, ticket_code")
      .eq("id", data.id)
      .single();

    // Delete the registration
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", data.id);

    if (error) throw new Error(error.message);

    console.log(`[ADMIN] Deleted registration: ${reg?.full_name} (${reg?.email}) - Ticket: ${reg?.ticket_code}`);
    return { ok: true, deleted: reg };
  });

export const bulkVerifyPendingRegistrations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasAdminRole(roles);

    // Get count of pending registrations
    const { count: pendingCount, error: countError } = await supabase
      .from("registrations")
      .select("id", { count: "exact", head: true })
      .eq("verification_status", "pending");

    if (countError) throw new Error(countError.message);

    if (!pendingCount || pendingCount === 0) {
      return { ok: true, verified: 0, message: "No pending registrations to verify" };
    }

    // Bulk update all pending to verified
    const { error: updateError, data } = await supabase
      .from("registrations")
      .update({
        verification_status: "verified",
        verification_model: "manual-bulk-verify",
        verification_reason: `Bulk verified by admin (${userId}) for legacy registrations`,
        verification_checked_at: new Date().toISOString(),
      })
      .eq("verification_status", "pending")
      .select("id");

    if (updateError) throw new Error(updateError.message);

    const verified = (data ?? []).length;
    console.log(`[ADMIN] Bulk verified ${verified} pending registrations`);

    return { ok: true, verified, message: `Successfully verified ${verified} registration${verified !== 1 ? "s" : ""}` };
  });

export const resendTicketEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasStaffRole(roles);

    // Get registration details
    const { data: reg, error: fetchError } = await supabase
      .from("registrations")
      .select("id, full_name, email, ticket_code, sector, attendee_type, attendance_mode, state")
      .eq("id", data.id)
      .single();

    if (fetchError || !reg) {
      throw new Error("Registration not found");
    }

    // Send the ticket email
    const emailResult = await sendTicketEmail({
      to: reg.email,
      fullName: reg.full_name,
      ticketCode: reg.ticket_code,
      sector: reg.sector,
      attendeeType: reg.attendee_type,
      attendanceMode: reg.attendance_mode,
      state: reg.state,
    });

    if (!emailResult.ok) {
      throw new Error(`Failed to send email: ${emailResult.error}`);
    }

    console.log(`[ADMIN] Resent ticket email to: ${reg.full_name} (${reg.email}) - Ticket: ${reg.ticket_code}`);
    return { ok: true, email: reg.email, messageId: emailResult.id };
  });

export const getCertificateSignedUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ path: z.string().min(1).max(500) }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasStaffRole(roles);
    const { data: signed, error } = await supabase.storage
      .from("yali-certificates")
      .createSignedUrl(data.path, 60 * 10);
    if (error) throw new Error(error.message);
    return { url: signed.signedUrl };
  });

export type DashboardStats = {
  totals: {
    total: number;
    paid: number;
    pending_payment: number;
    verified: number;
    checked_in: number;
    last_24h: number;
    revenue_kobo: number;
  };
  byAttendeeType: Array<{ key: string; count: number }>;
  byVerification: Array<{ key: string; count: number }>;
  byPayment: Array<{ key: string; count: number }>;
  byTrack: Array<{ key: string; count: number }>;
  byState: Array<{ key: string; count: number }>;
  trend30d: Array<{ date: string; count: number }>;
  recent: Array<{
    id: string;
    full_name: string;
    email: string;
    attendee_type: string;
    verification_status: string;
    payment_status: string;
    ticket_code: string;
    created_at: string;
  }>;
};

export const getAdminDashboard = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DashboardStats> => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();

    const roles = await getUserRoles(supabase, userId);
    assertHasStaffRole(roles);

    const { data: registrations, error } = await supabase
      .from("registrations")
      .select("attendee_type, verification_status, payment_status, track_selection, state, created_at, checked_in_at");

    if (error) throw new Error(error.message);
    if (!registrations) return {} as DashboardStats;

    const total = registrations.length;
    const verified = registrations.filter(r => r.verification_status === "verified").length;
    const checked_in = registrations.filter(r => r.checked_in_at).length;
    const last_24h = registrations.filter(r => new Date(r.created_at).getTime() > Date.now() - 86400000).length;

    const byAttendeeType = Object.entries(
      registrations.reduce((acc, r) => ({ ...acc, [r.attendee_type]: (acc[r.attendee_type] || 0) + 1 }), {} as Record<string, number>)
    ).map(([key, count]) => ({ key, count }));

    const byVerification = Object.entries(
      registrations.reduce((acc, r) => ({ ...acc, [r.verification_status]: (acc[r.verification_status] || 0) + 1 }), {} as Record<string, number>)
    ).map(([key, count]) => ({ key, count }));

    const byPayment = Object.entries(
      registrations.reduce((acc, r) => ({ ...acc, [r.payment_status || "unknown"]: (acc[r.payment_status || "unknown"] || 0) + 1 }), {} as Record<string, number>)
    ).map(([key, count]) => ({ key, count }));

    const byTrack = Object.entries(
      registrations.reduce((acc, r) => ({ ...acc, [r.track_selection || "none"]: (acc[r.track_selection || "none"] || 0) + 1 }), {} as Record<string, number>)
    ).map(([key, count]) => ({ key, count }));

    const byState = Object.entries(
      registrations.reduce((acc, r) => ({ ...acc, [r.state || "unknown"]: (acc[r.state || "unknown"] || 0) + 1 }), {} as Record<string, number>)
    ).map(([key, count]) => ({ key, count }));

    const trend30d = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split("T")[0];
      const count = registrations.filter(r => r.created_at.startsWith(dateStr)).length;
      return { date: dateStr, count };
    });

    const recent = registrations
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map(r => ({
        id: r.id || "",
        full_name: r.full_name || "",
        email: r.email || "",
        attendee_type: r.attendee_type || "",
        verification_status: r.verification_status || "",
        payment_status: r.payment_status || "",
        ticket_code: r.ticket_code || "",
        created_at: r.created_at,
      }));

    return {
      totals: { total, paid: total, pending_payment: 0, verified, checked_in, last_24h, revenue_kobo: 0 },
      byAttendeeType,
      byVerification,
      byPayment,
      byTrack,
      byState,
      trend30d,
      recent,
    };
  });

export const checkInVirtual = createServerFn({ method: "POST" })
  .inputValidator((input) => codeSchema.parse(input))
  .handler(async ({ data }) => {
    const supabase = createServerSupabase();

    const { data: existing, error: e1 } = await supabase
      .from("registrations")
      .select("id, full_name, attendee_type, track_selection, verification_status, virtual_checked_in_at")
      .eq("ticket_code", data.code)
      .maybeSingle();
    if (e1) throw new Error(e1.message);
    if (!existing) throw new Error("Ticket not found");

    if (existing.virtual_checked_in_at) {
      return { alreadyCheckedIn: true, registration: existing };
    }

    const { data: updated, error: e2 } = await supabase
      .from("registrations")
      .update({ virtual_checked_in_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select("id, full_name, attendee_type, track_selection, verification_status, virtual_checked_in_at")
      .single();
    if (e2) throw new Error(e2.message);
    return { alreadyCheckedIn: false, registration: updated };
  });

export const getCheckInStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasStaffRole(roles);

    // Get total registrations
    const { count: total } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    // Get checked in count
    const { count: checkedIn } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .not("checked_in_at", "is", null);

    // Get by attendee type
    const { data: byType } = await supabase
      .from("registrations")
      .select("attendee_type, checked_in_at")
      .order("attendee_type");

    const typeStats = (byType ?? []).reduce((acc: any, row: any) => {
      if (!acc[row.attendee_type]) {
        acc[row.attendee_type] = { total: 0, checkedIn: 0 };
      }
      acc[row.attendee_type].total++;
      if (row.checked_in_at) acc[row.attendee_type].checkedIn++;
      return acc;
    }, {});

    // Get check-ins in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count: checkedInLastHour } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .gte("checked_in_at", oneHourAgo);

    const pending = (total ?? 0) - (checkedIn ?? 0);
    const checkInRate = (checkedInLastHour ?? 0) + " per hour";

    return {
      total: total ?? 0,
      checkedIn: checkedIn ?? 0,
      pending,
      checkInRate,
      percentage: total ? Math.round(((checkedIn ?? 0) / total) * 100) : 0,
      byType: typeStats,
    };
  });

export const getVirtualCheckInStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasStaffRole(roles);

    // Get total registrations
    const { count: total } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true });

    // Get virtual checked in count
    const { count: virtualCheckedIn } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .not("virtual_checked_in_at", "is", null);

    // Get virtual attendees list
    const { data: virtualAttendees } = await supabase
      .from("registrations")
      .select("id, ticket_code, full_name, email, attendee_type, track_selection, verification_status, virtual_checked_in_at")
      .not("virtual_checked_in_at", "is", null)
      .order("virtual_checked_in_at", { ascending: false });

    const pending = (total ?? 0) - (virtualCheckedIn ?? 0);

    return {
      total: total ?? 0,
      virtualCheckedIn: virtualCheckedIn ?? 0,
      pending,
      percentage: total ? Math.round(((virtualCheckedIn ?? 0) / total) * 100) : 0,
      attendees: virtualAttendees ?? [],
    };
  });

export const listVirtualAttendees = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasStaffRole(roles);

    const { data: attendees, error } = await supabase
      .from("registrations")
      .select("id, ticket_code, full_name, email, phone, attendee_type, track_selection, verification_status, virtual_checked_in_at, created_at")
      .order("virtual_checked_in_at", { ascending: false, nullsFirst: false })
      .limit(500);

    if (error) throw new Error(error.message);
    return { attendees: attendees ?? [] };
  });

export const markVirtualAttendance = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasStaffRole(roles);

    const { data: updated, error } = await supabase
      .from("registrations")
      .update({ virtual_checked_in_at: new Date().toISOString() })
      .eq("id", data.id)
      .select("id, full_name, virtual_checked_in_at")
      .single();

    if (error) throw new Error(error.message);
    return updated;
  });

export const sendWhatsAppBulkMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ message: z.string().min(1), recipientType: z.enum(["all", "physical", "virtual"]) }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasAdminRole(roles);

    const termiiApiKey = process.env.TERMII_API_KEY;
    if (!termiiApiKey) throw new Error("Termii API key not configured");

    // Get attendees with phone numbers
    let query = supabase
      .from("registrations")
      .select("id, full_name, phone, attendance_mode")
      .not("phone", "is", null);

    if (data.recipientType === "physical") {
      query = query.eq("attendance_mode", "physical");
    } else if (data.recipientType === "virtual") {
      query = query.eq("attendance_mode", "virtual");
    }

    const { data: attendees, error } = await query.limit(1000);
    if (error) throw new Error(error.message);

    if (!attendees || attendees.length === 0) {
      return { sent: 0, failed: 0, results: [] };
    }

    // Send messages via Termii WhatsApp API
    const results: Array<{ name: string; phone: string; success: boolean; messageId?: string; error?: string }> = [];
    let sent = 0;
    let failed = 0;

    for (const attendee of attendees) {
      try {
        const response = await fetch("https://v4.api.termii.com/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: termiiApiKey,
            to: attendee.phone,
            from: "YALI Summit",
            sms: data.message,
            channel: "whatsapp",
            message_type: "text",
          }),
        });

        const result = await response.json() as any;
        if (result.status === "success" || response.ok) {
          results.push({
            name: attendee.full_name,
            phone: attendee.phone,
            success: true,
            messageId: result.message_id,
          });
          sent++;
        } else {
          results.push({
            name: attendee.full_name,
            phone: attendee.phone,
            success: false,
            error: result.message || "Unknown error",
          });
          failed++;
        }
      } catch (e) {
        results.push({
          name: attendee.full_name,
          phone: attendee.phone,
          success: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
        failed++;
      }
    }

    return { sent, failed, total: attendees.length, results };
  });

export const getWhatsAppBulkPreview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ recipientType: z.enum(["all", "physical", "virtual"]) }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasAdminRole(roles);

    let query = supabase
      .from("registrations")
      .select("id, full_name, phone, attendance_mode, email", { count: "exact", head: false })
      .not("phone", "is", null);

    if (data.recipientType === "physical") {
      query = query.eq("attendance_mode", "physical");
    } else if (data.recipientType === "virtual") {
      query = query.eq("attendance_mode", "virtual");
    }

    const { data: attendees, count, error } = await query.limit(10);
    if (error) throw new Error(error.message);

    return {
      totalRecipients: count ?? 0,
      preview: (attendees ?? []).map((a: any) => ({ name: a.full_name, phone: a.phone, mode: a.attendance_mode })),
    };
  });

export const exportAttendeesEmails = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ mode: z.enum(["physical", "virtual", "all"]) }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasStaffRole(roles);

    let query = supabase
      .from("registrations")
      .select("full_name, email, ticket_code, attendance_mode")
      .not("email", "is", null)
      .order("full_name", { ascending: true });

    if (data.mode === "physical") {
      query = query.eq("attendance_mode", "physical");
    } else if (data.mode === "virtual") {
      query = query.eq("attendance_mode", "virtual");
    }

    const { data: attendees, error } = await query;
    if (error) throw new Error(error.message);

    if (!attendees || attendees.length === 0) {
      return { emails: [], count: 0, csv: "" };
    }

    // Generate CSV
    const headers = ["Name", "Email", "Ticket Code", "Type"];
    const csvRows = attendees.map((a: any) => [
      `"${a.full_name.replace(/"/g, '""')}"`,
      a.email,
      a.ticket_code,
      a.attendance_mode === "physical" ? "Physical" : "Virtual",
    ]);
    const csv = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");

    return {
      emails: attendees,
      count: attendees.length,
      csv,
    };
  });

export const sendWhatsAppTestMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ message: z.string().min(1), phoneNumbers: z.array(z.string().min(7)) }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context as { userId: string };
    const supabase = createServerSupabase();
    const roles = await getUserRoles(supabase, userId);
    assertHasAdminRole(roles);

    const termiiApiKey = process.env.TERMII_API_KEY;
    if (!termiiApiKey) throw new Error("Termii API key not configured");

    const results: Array<{ phone: string; success: boolean; messageId?: string; error?: string }> = [];
    let sent = 0;
    let failed = 0;

    for (const phone of data.phoneNumbers) {
      try {
        const response = await fetch("https://v4.api.termii.com/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: termiiApiKey,
            to: phone,
            from: "YALI Summit",
            sms: data.message,
            channel: "whatsapp",
            message_type: "text",
          }),
        });

        const result = await response.json() as any;
        if (result.status === "success" || response.ok) {
          results.push({
            phone,
            success: true,
            messageId: result.message_id,
          });
          sent++;
        } else {
          results.push({
            phone,
            success: false,
            error: result.message || "Unknown error",
          });
          failed++;
        }
      } catch (e) {
        results.push({
          phone,
          success: false,
          error: e instanceof Error ? e.message : "Unknown error",
        });
        failed++;
      }
    }

    return { sent, failed, total: data.phoneNumbers.length, results };
  });