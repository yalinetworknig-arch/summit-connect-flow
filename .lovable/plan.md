
# YALI Network Nigeria — Platform Roadmap

The AIDIFILN 2026 attendee portal becomes v0 of a permanent platform for YALI Network Nigeria: connecting members across all 36 states + FCT, enabling inter-hub collaboration, running future events, and tracking real impact.

This plan delivers two things:

1. **Future-proofing tweaks to the current Phase 1 build** so we don't have to rip up the schema in three months.
2. **A committed `docs/ROADMAP.md`** capturing the 6-phase vision, decision log, and data-model evolution.

---

## Part A — Phase 1 future-proofing (ship now)

Tiny, additive changes to what we're already building. Zero UX impact on the summit.

### 1. `attendee_profiles` → de-facto `members` table

Add the columns we'll need to make this the permanent member identity:

```text
attendee_profiles
  + home_state        text       -- mirrored from registrations.state on claim
  + hub_affiliations  text[]     -- empty for now; multi-hub model (e.g. ['Lagos','Diaspora'])
  + linkedin_sub      text       -- nullable; populated once LinkedIn OAuth lands
  + sectors           text[]     -- empty for now; ['climate','governance','edtech'…]
  + is_active_member  boolean    -- default true; lets us archive without deleting
```

The claim-ticket server fn already copies `registration_id`; we extend it to also copy `state → home_state`. No new UI in Phase 1 — Settings just gets a disabled "Hubs" placeholder card so members know more is coming.

### 2. Role enum extension

`app_role` gets `hub_admin` added now (unused in Phase 1) so we don't migrate the enum later when Phase 3 lands.

### 3. Naming convention discipline

- `session_bookmarks.session_id` and `hackathon_entries` stay summit-scoped — documented in ROADMAP as "will migrate to generic `event_submissions` in Phase 4".
- No premature generalization; just a paper trail.

### 4. Settings tab teaser

A read-only "Your Hubs" + "Your Sectors" card on `/profile/settings` showing the member's `home_state` and an empty sectors list with copy: "Hub features launch after the summit." Sets expectations and validates the data model with a real render.

---

## Part B — `docs/ROADMAP.md` (commit to repo)

Single source of truth, lives in the repo, updated as we ship phases.

### Document structure

```text
docs/ROADMAP.md
  ## Vision
    Why the platform exists; what success looks like in 12/24 months.
  ## Architectural principles
    - Multi-hub identity (members ↔ many hubs, never forced to one)
    - Events are generic; AIDIFILN is the first instance
    - Hub autonomy + national rollup (federation, not centralization)
    - PWA-first; works on low-bandwidth Android
    - RLS everywhere; service_role only in server fns
  ## Phases (1 → 6, see below)
  ## Data model evolution
    Per-phase diff of new tables + columns
  ## Decision log
    Append-only: dated decisions + tradeoffs (multi-hub model, LinkedIn OAuth deferral, etc.)
  ## Open questions
    Living list for each phase
```

### Phase 1 — Summit portal (now)
Account + ticket claim, agenda, hackathon/pitch, checked-in networking, settings. Plus Part A tweaks above.

### Phase 2 — Post-summit "stay connected" (Q1 after summit)
- Member directory opens beyond checked-in (verified members)
- LinkedIn OAuth (`linkedin_sub` populated, replaces pasted URLs)
- Member-to-member messaging (lightweight, async)
- Email digest: hub activity, opportunities

### Phase 3 — State Hubs as first-class entities
- `hubs` table (one per state + FCT, seeded from existing `StateHubs.tsx` data)
- `hub_members` join table (multi-hub: a member can belong to many)
- Hub pages (`/hubs/lagos`, `/hubs/kaduna`…) replacing the static marquee
- `hub_admin` role activated; hub admins post updates, manage their hub page
- Members join/leave hubs from `/profile/settings`

### Phase 4 — Generic events platform
Refactor summit-specific tables into reusable ones:

```text
events                  (id, slug, name, host_hub_ids[], starts_at, ends_at, …)
event_registrations     (replaces registrations; FK to events)
event_submissions       (replaces hackathon_entries; type='hackathon'|'pitch'|'project')
event_sessions          (replaces static event-data.ts; FK to events)
session_bookmarks       (already generic; just point session_id at event_sessions.id)
```

Migration is a one-shot: existing AIDIFILN data backfilled into `events` row id=1. Any hub can publish events; cross-hub events list multiple `host_hub_ids`.

### Phase 5 — Inter-hub collaboration & impact
- `projects` (sector-tagged, owned by 1+ hubs, 1+ members)
- `collaborations` (project ↔ hub/member edges)
- `impact_metrics` (people_reached, funds_raised_kobo, policy_wins, custom kpis)
- Public impact dashboards per hub + national rollup at `/impact`
- Sector pages (`/sectors/climate`) aggregate cross-hub work

### Phase 6 — Engagement layer
- On-demand masterclass library (video + materials)
- Mentorship matching (skills/sectors based)
- Opportunities board (grants, fellowships, jobs) — hub admins post
- Push notifications (PWA already installed)
- Public stats API for partners / press

---

## Risks & mitigations

- **Schema sprawl** — every phase adds tables. Mitigation: each phase's ROADMAP section lists the exact diff; we resist adding columns mid-phase.
- **Hub admin abuse** — Phase 3 onward. Mitigation: national admins can demote; hub admin actions logged in `audit_log` (added Phase 3).
- **Privacy regression** — opening directory in Phase 2 must be opt-in per existing `networking_opt_in` flag (default flips to false post-summit until member confirms).
- **Vendor lock** — staying on Supabase + TanStack Start; no platform-specific features that prevent self-hosting later.

---

## Out of scope for this planning round

- Building any of Phase 2–6 now. We commit to the doc + Part A tweaks only.
- LinkedIn OAuth wiring (just the column).
- Mobile native apps — PWA is the strategy.

---

## What ships when you approve

1. Migration adding 5 columns to `attendee_profiles` + `hub_admin` to `app_role` enum.
2. `claimTicket` server fn updated to copy `state → home_state`.
3. `/profile/settings` gets the "Your Hubs" / "Your Sectors" read-only teaser card.
4. `docs/ROADMAP.md` committed with the full structure above.

No changes to summit-critical flows (ticket, payment, agenda, hackathon, network) beyond the additive schema.

---

## One open question for you

Before I write the migration: do you want hub coordinators (the YALI Network state coordinators you already know) to be seeded into `user_roles` as `hub_admin` now with placeholder accounts, or wait until Phase 3 when there's a UI for them to actually use? My recommendation: **wait** — seeding inactive admin accounts creates security surface area for no benefit.
