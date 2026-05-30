## Goal

After a successful registration, automatically email the delegate a branded confirmation containing their ticket code, QR-friendly link to `/ticket/:code`, and event details — sent through Resend via Lovable's connector gateway.

## Approach

Use the **Resend connector** (gateway-based), so no API key handling on our side beyond linking the connection. The send happens server-side from `submitRegistration` immediately after the row is inserted. Failures are logged but never block the registration response — the user still gets their ticket page.

## Steps

1. **Connect Resend** via the standard connector picker. This exposes `RESEND_API_KEY` + `LOVABLE_API_KEY` to server functions.

2. **Create `src/lib/email/ticket-email.ts`** — server-only helper that:
   - Builds the absolute ticket URL from the request origin (or a `VITE_PUBLIC_SITE_URL` fallback, defaulting to the published lovable.app URL).
   - Renders a branded HTML email (inline styles, navy + cyan to match the app, white body background) with: greeting, attendee type + track, ticket code in a monospace pill, big CTA button → `/ticket/:code`, event dates/venue, "show this at the door" note, plain-text fallback.
   - Calls `https://connector-gateway.lovable.dev/resend/emails` with `Authorization: Bearer LOVABLE_API_KEY` and `X-Connection-Api-Key: RESEND_API_KEY`.
   - `from`: `"YALI Summit <onboarding@resend.dev>"` initially (works without domain verification); leaves a TODO comment to swap to a verified domain later.
   - Returns `{ ok, id?, error? }` — never throws.

3. **Wire it into `src/lib/registrations.functions.ts`** — after the successful insert in `submitRegistration`, fire-and-await the email send wrapped in try/catch; log errors with `console.error` so they surface in server-function-logs but the function still returns the registration row. Skip if `row.email` is empty.

4. **Tiny confirmation copy update** on `src/routes/register.$id.tsx` — add a line "We've emailed your ticket to <email>" beneath the existing ticket preview (no functional change beyond text).

## Out of scope

- React Email templates / Lovable Email infrastructure (user asked for Resend specifically).
- Domain verification on Resend (uses `onboarding@resend.dev` sender until user adds a verified domain).
- Retries / queue / suppression list — single best-effort send; safe to add later.
- Re-send button or admin "resend ticket" action.

## Technical notes

- Resend is a gateway connector → must call `connector-gateway.lovable.dev/resend/emails`, NOT `api.resend.com` directly.
- Email body background: `#ffffff` per email rules; accent colors inline.
- No new packages required (native `fetch`).
- No DB changes.
