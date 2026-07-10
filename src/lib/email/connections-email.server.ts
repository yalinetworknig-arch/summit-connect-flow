import { renderEmailShell, escapeHtml, emailColors } from "@/lib/email/shell.server";

export type ContactEntry = {
  full_name: string;
  email: string;
  phone: string | null;
  attendee_type: string;
  state: string | null;
  linkedin_url: string | null;
};

function initials(name: string): string {
  return name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function renderContactCardHtml(c: ContactEntry, isLast: boolean) {
  const meta = [c.attendee_type, c.state].filter(Boolean).join(" · ");
  return `
  <tr>
    <td style="padding:${isLast ? "0" : "0 0 12px"};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${emailColors.bg};border:1px solid ${emailColors.border};border-radius:14px;">
        <tr>
          <td style="padding:16px 18px;" valign="top" width="46">
            <div style="width:38px;height:38px;line-height:38px;border-radius:999px;background:${emailColors.cyan};color:${emailColors.navy};font-weight:800;font-size:14px;text-align:center;">
              ${escapeHtml(initials(c.full_name))}
            </div>
          </td>
          <td style="padding:16px 18px 16px 0;" valign="top">
            <div style="font-size:15px;font-weight:700;color:${emailColors.ink};">${escapeHtml(c.full_name)}</div>
            <div style="font-size:12px;color:${emailColors.sub};text-transform:capitalize;margin-top:2px;">${escapeHtml(meta)}</div>
            <div style="font-size:13px;margin-top:8px;">
              <a href="mailto:${escapeHtml(c.email)}" style="color:${emailColors.navy};text-decoration:none;font-weight:600;">${escapeHtml(c.email)}</a>${c.phone ? `<span style="color:${emailColors.sub};"> · </span><a href="tel:${escapeHtml(c.phone)}" style="color:${emailColors.navy};text-decoration:none;font-weight:600;">${escapeHtml(c.phone)}</a>` : ""}
            </div>
            ${c.linkedin_url ? `<div style="font-size:13px;margin-top:4px;"><a href="${escapeHtml(c.linkedin_url)}" style="color:#0A66C2;text-decoration:none;font-weight:600;">LinkedIn profile →</a></div>` : ""}
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function renderHtml(firstName: string, contacts: ContactEntry[]) {
  const bodyHtml = `
    <tr>
      <td style="padding:36px 32px 6px;">
        <div style="font-size:22px;font-weight:800;color:${emailColors.ink};letter-spacing:-0.3px;">Your summit connections, ${escapeHtml(firstName)}</div>
        <p style="margin:8px 0 0;font-size:14.5px;line-height:1.6;color:${emailColors.sub};">
          Here ${contacts.length === 1 ? "is the contact you" : `are the ${contacts.length} contacts you`} exchanged QR codes with at AIDIFILN 2026. Keep the conversation going!
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px 34px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${contacts.map((c, i) => renderContactCardHtml(c, i === contacts.length - 1)).join("")}
        </table>
      </td>
    </tr>
  `;

  return renderEmailShell({
    preheader: `You made ${contacts.length} connection${contacts.length === 1 ? "" : "s"} at AIDIFILN 2026 — here are their details`,
    bodyHtml,
  });
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
