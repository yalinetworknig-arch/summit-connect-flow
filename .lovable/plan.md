## Goal

Turn the existing `ticket_code` on `registrations` into a full Eventbrite/Tix Africa-style ticketing flow: every delegate gets a branded QR ticket immediately after registering, receives it by email, can pull it up at the door, and on-site staff scan it with a phone-based check-in app. The AI certificate verification status is shown as a badge on the ticket and surfaced to staff at check-in.

## What the user gets

1. **Public ticket page** at `/ticket/:code`
   - Big QR code (encodes the ticket URL), attendee name, attendee type, track, ticket code (short, copyable), event date/venue
   - Verification badge: Verified (green), Pending review (amber), Suspicious (amber + tooltip), Rejected (red)
   - Buttons: "Add to Calendar" (.ics download), "Save as PDF" (browser print to PDF with print stylesheet), "Share"
   - Works offline once loaded (cached); accessible without login

2. **Ticket email** sent automatically on successful registration
   - Branded React Email template with QR code (rendered as inline image data URL), summit dates, link to full ticket page, "Add to Calendar" link
   - Subject: "Your YALI Summit ticket — [Name]"
   - Sent via Lovable Email infrastructure (no extra setup the user pays for)

3. **Registration success screen update**
   - Replaces the current generic confirmation with a mini ticket preview + "View your ticket" + "We've emailed your ticket to <email>"

4. **Admin check-in scanner** at `/admin/check-in`
   - Camera-based QR scanner (works on phones in browser)
   - Shows attendee details, verification badge, and check-in status on scan
   - "Check in" button marks `checked_in_at`; second scan shows "Already checked in at HH:MM"
   - Warning banner if verification_status is suspicious/rejected/pending so staff can ask follow-up questions
   - Manual lookup by ticket code as fallback
   - Protected by admin role

5. **Admin registrations list** at `/admin/registrations`
   - Table of all registrations with filter by verification_status and checked_in
   - Row actions: view certificate, override verification (verified / rejected), open ticket
   - Required because verification needs admin review

## Technical plan

**Database (one migration)**
- `registrations`: add `checked_in_at timestamptz`, `checked_in_by uuid` (auth.users), index on `ticket_code`
- New `user_roles` table + `app_role` enum (`admin`, `staff`) + `has_role()` security definer function (following the user-roles pattern; required to gate admin pages and the check-in mutation)
- RLS: add `SELECT` policy on `registrations` for admins/staff via `has_role`; add `UPDATE` policy for check-in (admins/staff, only `checked_in_at` / `checked_in_by` columns via a dedicated server function using the admin client)
- Public ticket lookup happens through a server function that returns a sanitized DTO (name, type, track, verification_status, checked_in flag, event info) — no RLS-readable policy for anon on the full row

**Server functions (`src/lib/`)**
- `tickets.functions.ts`
  - `getTicketByCode({ code })` — public, returns sanitized ticket DTO or 404
  - `checkInTicket({ code })` — admin-only (`requireSupabaseAuth` + role check), sets `checked_in_at`
  - `listRegistrations({ filter })` — admin-only
  - `overrideVerification({ id, status, reason })` — admin-only
- `tickets.ics.ts` — server route at `/api/public/ticket/:code/calendar.ics` returning an .ics file

**Frontend routes**
- `src/routes/ticket.$code.tsx` — public ticket page (QR via `qrcode` package, print stylesheet)
- `src/routes/_authenticated/admin/check-in.tsx` — scanner page (uses `@yudiel/react-qr-scanner` or `html5-qrcode`)
- `src/routes/_authenticated/admin/registrations.tsx` — admin table
- `src/routes/login.tsx` — basic Supabase email/password login (required because there's no auth yet and admin pages need it)
- Update `src/components/register/StepConfirm.tsx` (or equivalent) to redirect to `/ticket/:code` and show the email-sent confirmation

**Email**
- Run email infra + transactional scaffold tools
- Add `ticket-confirmation` template with QR (inline data URL generated server-side via `qrcode` package)
- Call from existing `submitRegistration` server function right after successful insert, with idempotency key `ticket-${registration.id}`

**Packages**
- `qrcode` (server-side QR generation for email + ticket DTO)
- `html5-qrcode` or `@yudiel/react-qr-scanner` (camera scanner)

**Important caveat to flag**
- This adds authentication to the project for the first time. The admin scanner and registrations pages won't work until you create an admin user and assign the `admin` role. After the migration runs, I'll walk you through inserting your admin row.

## Out of scope (call out, don't build)
- Paid ticketing / Paystack tie-in beyond what's already in `registrations`
- SMS/WhatsApp delivery of tickets
- Multiple ticket tiers, transfers, refunds
- Native mobile scanner app (browser camera works fine on phones)
