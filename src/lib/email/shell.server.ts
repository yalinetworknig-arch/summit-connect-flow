const LOGO_URL = "https://summit.yalinetwork.ng/assets/aidifiln-logo-rainbow-oJQrnYK8.png";

const COLORS = {
  navy: "#0A1128",
  navySoft: "#131C3D",
  cyan: "#22D3EE",
  ink: "#0A1128",
  sub: "#5B6577",
  border: "#E5E9F2",
  bg: "#F4F6FB",
  card: "#FFFFFF",
};

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

/** Renders a full HTML email document with a consistent branded header/footer.
 *  bodyHtml is the inner content — should be one or more <tr> rows for a
 *  <table role="presentation"> that will be nested inside the card. */
export function renderEmailShell(input: {
  preheader: string;
  eyebrow?: string;
  bodyHtml: string;
}): string {
  const eyebrow = input.eyebrow ?? "YALI SUMMIT 2026 · SEPT 24–26 · IKEJA, LAGOS";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title></title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${COLORS.bg};">
    ${escapeHtml(input.preheader)}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:28px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="background:${COLORS.navy};border-radius:20px 20px 0 0;padding:26px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td valign="middle">
                    <img src="${LOGO_URL}" alt="AIDIFILN" height="30" style="display:block;height:30px;width:auto;border:0;" />
                  </td>
                  <td valign="middle" align="right" style="font-family:${FONT_STACK};font-size:10.5px;letter-spacing:1.4px;color:rgba(255,255,255,0.55);font-weight:700;">
                    ${escapeHtml(eyebrow)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body card -->
          <tr>
            <td style="background:${COLORS.card};border-left:1px solid ${COLORS.border};border-right:1px solid ${COLORS.border};">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-family:${FONT_STACK};">
                ${input.bodyHtml}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${COLORS.navy};border-radius:0 0 20px 20px;padding:22px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:${FONT_STACK};font-size:12px;color:rgba(255,255,255,0.65);line-height:1.6;">
                    <strong style="color:#fff;">YALI Network Nigeria</strong><br/>
                    AIDIFILN 2026 · Daystar Oregun, Ikeja, Lagos · Sept 24–26<br/>
                    <a href="mailto:info@summit.yalinetwork.ng" style="color:${COLORS.cyan};text-decoration:none;">info@summit.yalinetwork.ng</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <tr>
            <td align="center" style="padding:16px 12px 0;font-family:${FONT_STACK};font-size:11px;color:#9BA3B4;">
              You're receiving this because you registered for or connected at YALI Summit 2026.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** A pill-shaped CTA button row, email-safe (table + VML fallback for Outlook). */
export function ctaButtonRow(href: string, label: string): string {
  return `<tr>
    <td align="center" style="padding:8px 0 4px;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:48px;v-text-anchor:middle;width:260px;" arcsize="50%" fillcolor="${COLORS.cyan}" stroke="f">
      <w:anchorlock/>
      <center style="color:${COLORS.navy};font-family:${FONT_STACK};font-size:15px;font-weight:700;">${escapeHtml(label)}</center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${href}" style="display:inline-block;background:${COLORS.cyan};color:${COLORS.navy};text-decoration:none;font-family:${FONT_STACK};font-weight:700;font-size:15px;padding:14px 32px;border-radius:999px;">
        ${escapeHtml(label)}
      </a>
      <!--<![endif]-->
    </td>
  </tr>`;
}

export const emailColors = COLORS;
export const emailFontStack = FONT_STACK;
