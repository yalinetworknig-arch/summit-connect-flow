# Where we are — AIDIFILN Summit 2026

## ✅ Solid / shipped
- **Shell & nav**: `TopNav` (light = white lockup, dark = rainbow lockup, both `h-10 md:h-12`, no dark glow), `Footer`, mobile `BottomTabBar`, `AppShell`
- **Home (`/`)**: real `Hero` + `Countdown`, `Stats`, `Partners`, `FAQ`
- **Registration flow (`/register`)**: 5 steps (attendee type → personal info → track → logistics → review/pay), Zod validation, draft autosave, Paystack inline (early-bird ₦15k / regular ₦20k / free for delegates), success page at `/register/$id`
- **Backend**: Supabase `registrations` table, `submitRegistration` + `getRegistrationById` server functions, ticket codes

## ⚠️ Stubs (just a heading + one-line placeholder)
- `/about`, `/contact`, `/schedule`, `/tracks`, `/sponsors`, `/network`, `/profile`, `/summit`
- Index page's inline `Schedule` and `Sector Tracks` sections are also placeholder text
- `/summit` is essentially a duplicate of `/` — needs a purpose or removal

## 🧩 Gaps worth noting
- No auth → `/profile` can't show "your registration" yet
- No speakers data/page
- No admin view of registrations
- Paystack key still optional fallback (saves as "free" if missing)

---

# Proposed next phase — "Fill the empty rooms"

Goal: turn every stub route into real, shareable content so the site is presentable end-to-end before layering in auth/admin.

### Phase 2A — Content pages (highest ROI, no backend work)
1. **`/about`** — mission, why AIDIFILN, organizing body, theme pillars, location/dates, CTA to register
2. **`/tracks`** — full 7-track grid (Health, Agriculture, Education, FinTech, Energy & Climate, Governance, Creative Economy) with icon, description, sample sessions, "register for this track" link. Replace the index placeholder with a condensed teaser linking here.
3. **`/schedule`** — 4-day timeline (Sept 10–13, 2026): Day 1 arrivals/opening, Day 2–3 tracks & workshops, Day 4 closing showcase. Tabbed by day, time-block cards.
4. **`/sponsors`** — tiers (Platinum/Gold/Silver/Community), benefits table, "Become a sponsor" inquiry form (writes to a `sponsor_inquiries` table) + downloadable deck placeholder
5. **`/contact`** — contact form (writes to `contact_messages` table), email, socials, venue map placeholder
6. **`/summit`** — either delete the route or repurpose as a "Summit overview" hub linking About/Schedule/Tracks/Sponsors

### Phase 2B — Cleanup
- Drop the placeholder Schedule/Tracks sections on the index in favor of richer teaser cards that link out
- Remove `/network` and `/profile` from `BottomTabBar` until they have real content, OR mark them clearly as "Coming soon" pages with a teaser

### Phase 3 (later, after content is in)
- Auth (Supabase) → real `/profile` showing the user's ticket, QR code, track selection
- Admin route (`/_authenticated/admin`) for registration list/export
- `/network` member directory (post-auth)
- Speakers page + data model

---

# Technical details
- New tables for 2A: `sponsor_inquiries`, `contact_messages` (both insert-only via server functions, with grants + RLS as per template rules)
- Tracks/schedule data: static TS files in `src/lib/` (no DB needed)
- Each new route gets its own `head()` meta (title, description, og:title, og:description)

---

# Question for you
Which slice do you want first? Suggested order: **2A in one pass** (About → Tracks → Schedule → Sponsors → Contact), then cleanup, then auth. Or pick a single page to start narrow.
