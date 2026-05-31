
# AIDIFILN Attendee Portal — Phase 1

Turn `/profile` into a real attendee account. Registrants sign up with email + password, claim their existing registration with their ticket code, and get a dashboard for tickets, payments, schedule, hackathon entry, and (after check-in) networking.

## What ships

1. **Account + ticket claim**
   - Email/password signup & login (Supabase Auth). Email verification on.
   - After signup, a "Claim your ticket" screen asks for the ticket code emailed at registration. We match the code + email and link the registration to the user.
2. **Profile dashboard (`/profile`)** — tabbed shell:
   - **Ticket** — QR (ticket_code), attendee type, track, status, add-to-calendar, download brochure (PDF).
   - **Payments** — amount, status (paid/pending), Paystack reference, receipt link for paid tickets; "Pay now" CTA for pending.
   - **Agenda** — full event schedule; bookmark masterclasses & breakouts → "My Schedule" view; ICS export per session.
   - **Hackathon / Pitch** — choose track (Hackathon or Pitch Competition), submit project info, optional team (invite by email), edit until deadline, see status (draft/submitted/under-review/shortlisted).
   - **Network** — visible only to users whose registration is `checked_in_at IS NOT NULL`. Directory of other checked-in attendees (name, state, attendee type, bio, LinkedIn URL). "Connect on LinkedIn" deep-link + "Save contact" (vCard). Save private notes per contact.
3. **Settings** — bio, headline, LinkedIn URL, photo, networking visibility toggle (default on once checked in), logout.

## Routes

```text
/login                       (exists — keep)
/signup                      (new)
/claim-ticket                (new, auth-required, run once)
/_authenticated/profile      (renamed home of attendee portal, tabbed)
  ├── ticket   (default)
  ├── payments
  ├── agenda
  ├── hackathon
  ├── network    (gated: requires checked_in)
  └── settings
```

Top-level `/profile` redirects to `/_authenticated/profile/ticket`. Bottom tab "Profile" points there.

## Data model (new tables + columns)

```text
attendee_profiles            1:1 with auth.users
  user_id (pk, fk auth.users)
  registration_id (fk registrations, unique, nullable until claimed)
  display_name, headline, bio, avatar_url, linkedin_url
  networking_opt_in (bool, default true)

session_bookmarks            agenda picks
  user_id, session_id, created_at  (pk: user_id+session_id)

hackathon_entries
  id, user_id, track ('hackathon'|'pitch'), project_name, summary,
  problem, solution, deck_url, repo_url, video_url,
  status ('draft'|'submitted'|'shortlisted'|'rejected'),
  submitted_at, updated_at

hackathon_team_members
  entry_id, email, full_name, role, invited_at, accepted_user_id (nullable)

networking_connections
  id, from_user, to_user, note (private to from_user), created_at
  (pk: from_user+to_user)
```

`registrations` already has `checked_in_at` — used as the network gate.

Sessions live in `src/lib/event-data.ts` for now (static), so `session_bookmarks.session_id` is a stable slug — no new sessions table yet.

## Security

- RLS on every new table:
  - `attendee_profiles`: owner can select/update own row; checked-in users can `SELECT` other rows where `networking_opt_in=true` AND that user is also checked in. Enforced by a `SECURITY DEFINER` function `is_checked_in(uid)` + policy using it.
  - `session_bookmarks`, `hackathon_entries`, `hackathon_team_members`: owner-only.
  - `networking_connections`: owner reads/writes own outgoing rows; the target user can see who connected with them but not the private note.
- Ticket claim runs server-side (`createServerFn` + `requireSupabaseAuth`): verifies `email === auth.user.email` AND `ticket_code` matches, then sets `attendee_profiles.registration_id`. One claim per registration; one registration per user.
- Service-role writes only inside server functions; never imported in components.

## Technical notes

- Server functions in `src/lib/portal.functions.ts` (`claimTicket`, `getMyProfile`, `updateMyProfile`, `bookmarkSession`, `getMyAgenda`, `upsertHackathonEntry`, `submitHackathonEntry`, `listNetworkAttendees`, `connectWithAttendee`).
- Use `requireSupabaseAuth` middleware; respect RLS — admin client only for the claim flow.
- TanStack Query + `useSuspenseQuery` on each tab; loaders call `ensureQueryData`.
- LinkedIn = `https://www.linkedin.com/in/<handle>` link the user pastes; no LinkedIn OAuth yet (can layer later via the LinkedIn connector).
- Brochure PDF goes in `public/brochure.pdf` placeholder.
- Bottom tab "Profile" stays; on auth redirect to `/login?redirect=/profile`.

## Out of scope (Phase 2)

- LinkedIn OAuth sign-in
- In-app messaging
- Per-session capacity & waitlist (you chose no caps for now)
- Admin review UI for hackathon entries (data is captured; admins can read via existing admin shell next pass)
- Push notifications & PWA badging

## Open question before build

The current `/login` redirects admins/staff to `/admin`. After this change, regular registrants who log in will land on `/profile`. Confirm that's the desired default, or specify a different landing route for non-staff users.
