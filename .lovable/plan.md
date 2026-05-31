## Admin Dashboard

Add a new landing page for the admin area at `/admin` that gives you a one-glance view of registrations broken down by every meaningful "level" (attendee type, verification status, payment, check-in, track, state), plus a trend over time. The existing `/admin/registrations` table and `/admin/check-in` scanner stay as drill-down pages — the dashboard links into them with filters pre-applied.

### What you'll see on the page

1. **Top KPI cards** (6 tiles)
   - Total registrations
   - Paid (payment_status = 'paid') + total revenue (sum of amount_kobo → ₦)
   - Pending payment count
   - Verified delegates (verification_status = 'verified')
   - Checked-in count (and % of total)
   - Registrations in the last 24h

2. **Breakdown cards** (grid of small bar/segment widgets)
   - By **attendee type**: delegate / sponsor / media / volunteer
   - By **verification status**: pending / verified / suspicious / rejected / error
   - By **payment status**: paid / pending / failed
   - By **track** (top 6 tracks + "Other")
   - By **state** (top 10 states, scrollable)

3. **Registrations over time** — line/area chart of daily counts for the last 30 days (recharts, already a transitive dep via shadcn chart).

4. **Recent registrations** — last 10 rows (name, type, status pill, time), each linking to `/admin/registrations?search=<email>`.

5. **Quick actions** strip — links to "All registrations", "Check-in scanner", "Export CSV" (CSV export is a follow-up; the button can be stubbed or omitted in this pass — say which you prefer).

Each breakdown segment is clickable and deep-links into `/admin/registrations` with the matching filter (e.g. clicking "Verified" jumps to the table filtered by verification=verified). This requires teaching `/admin/registrations` to read its initial filter values from URL search params (small additive change, no behavior change for existing users).

### Routes & navigation

- New route file: `src/routes/_authenticated.admin.index.tsx` → URL `/admin`. Already protected by the existing `_authenticated` gate which checks admin/staff roles.
- Add a top header on this page with tabs/links to: Dashboard (current), Registrations, Check-in. Mirror the same tab strip on the two existing admin pages so navigation is consistent.
- After login, admins land on `/admin` by default (update the post-login redirect logic in `src/routes/login.tsx` if it currently hardcodes `/`).

### Data layer (server)

Add one new server function in `src/lib/tickets.functions.ts`:

- `getAdminDashboard` — `createServerFn({ method: "POST" })`, protected by an admin/staff role check (same pattern used by `listRegistrations`). Returns a single payload:
  - `totals`: `{ total, paid, pending_payment, verified, checked_in, last_24h, revenue_kobo }`
  - `byAttendeeType`, `byVerification`, `byPayment`, `byTrack`, `byState` — each an array of `{ key, count }`
  - `trend30d` — array of `{ date: 'YYYY-MM-DD', count }` for the last 30 days (zero-filled)
  - `recent` — last 10 rows: `{ id, full_name, email, attendee_type, verification_status, payment_status, ticket_code, created_at }`

Implementation uses `supabaseAdmin` with grouped counts. Because PostgREST doesn't do GROUP BY directly, the function will either (a) run a few small parallel `select('col', { count: 'exact', head: true })` queries per bucket, or (b) call a new `public.admin_dashboard_stats()` SQL function for one round-trip. Recommendation: option (b) — one SECURITY DEFINER SQL function that returns JSON, called by the server fn. This keeps the server fn tiny and the SQL easy to audit. The function is gated by `has_role(auth.uid(),'admin' OR 'staff')` inside the SQL so it's safe even if invoked elsewhere.

No new tables. No RLS changes to `registrations`. One new DB function via migration.

### Files touched

- **New** `src/routes/_authenticated.admin.index.tsx` — dashboard page, recharts area chart, KPI/breakdown cards using existing semantic tokens (`--card`, `--text-primary`, `--accent-cyan`, status colors already used in `StatusPill`).
- **New** `src/components/admin/AdminTabs.tsx` — shared tab strip (Dashboard / Registrations / Check-in).
- **Edit** `src/lib/tickets.functions.ts` — add `getAdminDashboard`.
- **Edit** `src/routes/_authenticated.admin.registrations.tsx` — read initial `verification`, `checkedIn`, `search` from URL search params (via `validateSearch` + `Route.useSearch()`); render `<AdminTabs/>` at the top.
- **Edit** `src/routes/_authenticated.admin.check-in.tsx` — render `<AdminTabs/>` at the top (replaces the lone "Registrations" link).
- **Edit** `src/routes/login.tsx` — if user has admin/staff role, redirect to `/admin` instead of `/`.
- **New migration** — `public.admin_dashboard_stats()` SECURITY DEFINER function returning JSON, plus `GRANT EXECUTE` to `authenticated`.

### Open questions

1. CSV export of all registrations — include in this pass, or ship later?
2. Date range picker on the trend chart, or fixed 30 days for now (simpler)?
3. Should the dashboard auto-refresh every 30s, or only on manual refresh / route revisit?
