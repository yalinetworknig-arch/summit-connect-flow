import { getRequestHost } from "@tanstack/react-start/server";
import { renderEmailShell, ctaButtonRow, escapeHtml, emailColors } from "@/lib/email/shell.server";

type TicketEmailInput = {
  to: string;
  fullName: string;
  ticketCode: string;
  track?: string | null;
  attendeeType?: string | null;
};

function resolveOrigin(): string {
  const envUrl = process.env.VITE_PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  try {
    const host = getRequestHost();
    if (host) {
      const proto = host.includes("localhost") ? "http" : "https";
      return `${proto}://${host}`;
    }
  } catch {
    // not in request context
  }
  return "https://summit.yalinetwork.ng";
}

function renderHtml(input: TicketEmailInput, ticketUrl: string) {
  const firstName = input.fullName.split(" ")[0] || input.fullName;
  const detailRows = [
    input.track ? { label: "Track", value: input.track } : null,
    input.attendeeType ? { label: "Attendee type", value: input.attendeeType, capitalize: true } : null,
  ].filter((r): r is { label: string; value: string; capitalize?: boolean } => Boolean(r));

  const bodyHtml = `
    <tr>
      <td style="padding:36px 32px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
          <tr>
            <td width="40" height="40" align="center" valign="middle" style="width:40px;height:40px;border-radius:999px;background:${emailColors.cyan};font-size:18px;font-weight:800;color:${emailColors.navy};">✓</td>
          </tr>
        </table>
        <div style="font-size:22px;font-weight:800;color:${emailColors.ink};letter-spacing:-0.3px;">You're in, ${escapeHtml(firstName)}!</div>
        <p style="margin:8px 0 0;font-size:14.5px;line-height:1.6;color:${emailColors.sub};">
          Your registration for <strong style="color:${emailColors.ink};">AIDIFILN 2026</strong> is confirmed. Bring your ticket QR to check-in on-site.
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding:22px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${emailColors.bg};border:1.5px dashed ${emailColors.navy};border-radius:14px;">
          <tr>
            <td align="center" style="padding:18px 16px;">
              <div style="font-size:10.5px;letter-spacing:1.6px;text-transform:uppercase;color:${emailColors.sub};font-weight:700;">Ticket code</div>
              <div style="font-family:'SFMono-Regular',Consolas,Menlo,monospace;font-size:17px;font-weight:700;color:${emailColors.ink};margin-top:6px;word-break:break-all;">${escapeHtml(input.ticketCode)}</div>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${detailRows.length > 0 ? `
    <tr>
      <td style="padding:18px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13.5px;">
          ${detailRows.map((r, i) => `
          <tr>
            <td style="padding:8px 0;color:${emailColors.sub};${i > 0 ? `border-top:1px solid ${emailColors.border};` : ""}">${escapeHtml(r.label)}</td>
            <td style="padding:8px 0;text-align:right;font-weight:700;color:${emailColors.ink};${r.capitalize ? "text-transform:capitalize;" : ""}${i > 0 ? `border-top:1px solid ${emailColors.border};` : ""}">${escapeHtml(r.value)}</td>
          </tr>`).join("")}
        </table>
      </td>
    </tr>` : ""}

    <tr>
      <td style="padding:26px 32px 6px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${ctaButtonRow(ticketUrl, "View your ticket")}
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:0 32px 34px;">
        <p style="margin:0;font-size:12.5px;line-height:1.6;color:${emailColors.sub};text-align:center;">
          Or paste this link in your browser:<br/>
          <a href="${ticketUrl}" style="color:${emailColors.navy};word-break:break-all;">${ticketUrl}</a>
        </p>
      </td>
    </tr>
  `;

  return renderEmailShell({
    preheader: `Your AIDIFILN 2026 ticket is confirmed — code ${input.ticketCode}`,
    bodyHtml,
  });
}

function renderText(input: TicketEmailInput, ticketUrl: string) {
  return [
    `You're in, ${input.fullName.split(" ")[0] || input.fullName}!`,
    "",
    "Your registration for AIDIFILN 2026 (YALI Summit) is confirmed.",
    `Ticket code: ${input.ticketCode}`,
    input.track ? `Track: ${input.track}` : "",
    input.attendeeType ? `Attendee: ${input.attendeeType}` : "",
    "",
    `View your ticket: ${ticketUrl}`,
    "",
    "UNILAG Main Auditorium, Akoka Lagos — Sept 25–26, 2026",
  ].filter(Boolean).join("\n");
}

export async function sendTicketEmail(input: TicketEmailInput): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };
  if (!input.to) return { ok: false, error: "missing recipient" };

  const origin = resolveOrigin();
  const ticketUrl = `${origin}/ticket/${encodeURIComponent(input.ticketCode)}`;

  try {
    // 8-second timeout — don't let a slow/failing email block registration
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "YALI Summit <onboarding@resend.dev>",
        to: [input.to],
        subject: `Your YALI Summit 2026 ticket — ${input.ticketCode}`,
        html: renderHtml(input, ticketUrl),
        text: renderText(input, ticketUrl),
      }),
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `Resend ${res.status}: ${body}` };
    }
    const json = (await res.json()) as { id?: string };
    return { ok: true, id: json.id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg.includes("abort") ? "Email timed out (registration still saved)" : msg };
  }
}