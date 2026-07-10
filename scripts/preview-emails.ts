import { writeFileSync } from "fs";
import { renderEmailShell, ctaButtonRow, escapeHtml, emailColors } from "../src/lib/email/shell.server";

// --- Ticket email preview (mirrors ticket-email.server.ts renderHtml) ---
function renderTicketHtml() {
  const input = { fullName: "Chinwe Okafor", ticketCode: "8b00c05d-f004-4468-bd51-03cf20002988", track: "Energy & Climate", attendeeType: "delegate" };
  const ticketUrl = "https://summit.yalinetwork.ng/ticket/8b00c05d-f004-4468-bd51-03cf20002988";
  const firstName = input.fullName.split(" ")[0];
  const detailRows = [
    { label: "Track", value: input.track },
    { label: "Attendee type", value: input.attendeeType, capitalize: true },
  ];

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
    </tr>
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

// --- Connections digest preview (mirrors connections-email.server.ts renderHtml) ---
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

function renderContactCardHtml(c: { full_name: string; email: string; phone: string | null; attendee_type: string; state: string | null; linkedin_url: string | null }, isLast: boolean) {
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

function renderDigestHtml() {
  const firstName = "Benjamin";
  const contacts = [
    { full_name: "Akindiya Faidat", email: "akindiya@example.com", phone: "+234 801 234 5678", attendee_type: "volunteer", state: "Lagos", linkedin_url: "https://linkedin.com/in/akindiya" },
    { full_name: "Chinwe Okafor", email: "chinwe@example.com", phone: null, attendee_type: "delegate", state: "Enugu", linkedin_url: null },
  ];

  const bodyHtml = `
    <tr>
      <td style="padding:36px 32px 6px;">
        <div style="font-size:22px;font-weight:800;color:${emailColors.ink};letter-spacing:-0.3px;">Your summit connections, ${escapeHtml(firstName)}</div>
        <p style="margin:8px 0 0;font-size:14.5px;line-height:1.6;color:${emailColors.sub};">
          Here are the ${contacts.length} contacts you exchanged QR codes with at AIDIFILN 2026. Keep the conversation going!
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
    preheader: `You made ${contacts.length} connections at AIDIFILN 2026 — here are their details`,
    bodyHtml,
  });
}

writeFileSync("scripts/preview-ticket-email.html", renderTicketHtml());
writeFileSync("scripts/preview-digest-email.html", renderDigestHtml());
console.log("Wrote scripts/preview-ticket-email.html and scripts/preview-digest-email.html");
