export type ContactEntry = {
  full_name: string;
  email: string;
  phone: string | null;
  attendee_type: string;
  state: string | null;
  linkedin_url: string | null;
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function renderContactRowHtml(c: ContactEntry) {
  const meta = [c.attendee_type, c.state].filter(Boolean).join(" · ");
  return `<tr><td style="padding:14px 0;border-bottom:1px solid #e5e9f2;">
    <div style="font-size:15px;font-weight:700;">${escapeHtml(c.full_name)}</div>
    <div style="font-size:12px;color:#5b6577;text-transform:capitalize;margin-top:2px;">${escapeHtml(meta)}</div>
    <div style="font-size:13px;margin-top:6px;"><a href="mailto:${escapeHtml(c.email)}" style="color:#0A1128;">${escapeHtml(c.email)}</a>${c.phone ? ` · <a href="tel:${escapeHtml(c.phone)}" style="color:#0A1128;">${escapeHtml(c.phone)}</a>` : ""}</div>
    ${c.linkedin_url ? `<div style="font-size:13px;margin-top:4px;"><a href="${escapeHtml(c.linkedin_url)}" style="color:#0A66C2;">LinkedIn profile</a></div>` : ""}
  </td></tr>`;
}

function renderHtml(firstName: string, contacts: ContactEntry[]) {
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0A1128;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e9f2;">
        <tr><td style="background:#0A1128;padding:28px 32px;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;opacity:0.7;">YALI Summit 2026</div>
          <div style="font-size:22px;font-weight:700;margin-top:6px;">Your summit connections, ${escapeHtml(firstName)}</div>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <p style="margin:0 0 8px;font-size:15px;line-height:1.55;">Here ${contacts.length === 1 ? "is the contact you" : `are the ${contacts.length} contacts you`} exchanged at AIDIFILN 2026. Keep the conversation going!</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${contacts.map(renderContactRowHtml).join("")}
          </table>
        </td></tr>
        <tr><td style="padding:18px 32px;background:#0A1128;color:#ffffff;font-size:12px;">
          YALI Network Nigeria — see you next year.
        </td></tr>
      </table>
      <div style="font-size:11px;color:#8a93a6;margin-top:14px;">You received this because you swapped QR contacts at the summit.</div>
    </td></tr>
  </table>
</body></html>`;
}

function renderText(firstName: string, contacts: ContactEntry[]) {
  const lines = [
    `Your summit connections, ${firstName}`,
    "",
    `Contacts you exchanged at AIDIFILN 2026 (YALI Summit):`,
    "",
  ];
  for (const c of contacts) {
    lines.push(`• ${c.full_name} (${[c.attendee_type, c.state].filter(Boolean).join(", ")})`);
    lines.push(`  ${c.email}${c.phone ? ` · ${c.phone}` : ""}`);
    if (c.linkedin_url) lines.push(`  ${c.linkedin_url}`);
    lines.push("");
  }
  lines.push("YALI Network Nigeria");
  return lines.join("\n");
}

export async function sendConnectionsDigestEmail(input: {
  to: string;
  fullName: string;
  contacts: ContactEntry[];
}): Promise<{ ok: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };
  if (!input.to) return { ok: false, error: "missing recipient" };
  if (input.contacts.length === 0) return { ok: false, error: "no contacts" };

  const from = process.env.RESEND_FROM || "YALI Summit <onboarding@resend.dev>";
  const firstName = input.fullName.split(" ")[0] || input.fullName;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: `Your YALI Summit 2026 connections (${input.contacts.length})`,
        html: renderHtml(firstName, input.contacts),
        text: renderText(firstName, input.contacts),
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
    return { ok: false, error: msg.includes("abort") ? "Email timed out" : msg };
  }
}
