# YALI Summit 2026 — Alignment & Hardening Plan

The four pattern docs (`docs/motion-framer-patterns.md`, `docs/pwa-ux-patterns.md`, `docs/modern-web-standards.md`, `docs/21st-dev-patterns.md`) become the **design system source of truth** for every change below. Each phase explicitly references which doc rules apply.

## Phase 0 — Audit (no code changes yet)
- Compare current routes (`index`, `summit`, `register`, `tracks`, `schedule`, `sponsors`, `network`, `profile`, `about`, `contact`) against brief Section 01 scope.
- Verify design tokens in `src/styles.css` match the Design Language Card (navy `#0A1128`, cyan `#00D9FF`, surfaces, rainbow gradient, Space Grotesk + Inter).
- Verify Supabase schema vs brief: `registrations`, `sponsor_inquiries`, `contact_submissions`, `stats`, `pwa_analytics` — confirm fields cover delegate flow (tracks, logistics, dietary, YALI ID for delegates).
- Output: short gap report before any edits.

## Phase 1 — Design system & tokens (uses `modern-web-standards.md` + `21st-dev-patterns.md`)
- Move all hard-coded colors in components (Hero uses inline `style={{ background: 'var(--brand-navy)' }}`) into semantic Tailwind tokens defined in `src/styles.css` (oklch).
- Add tokens: `--brand-navy`, `--accent-cyan`, `--surface-dark`, `--surface-light`, `--text-primary/secondary`, `--gradient-rainbow`, `--shadow-elegant`.
- Wire Space Grotesk + Inter via `@import` in `styles.css`; remove ad-hoc `fontFamily` inline styles.
- Add `prefers-reduced-motion` and container-query base utilities per 21st-dev doc.

## Phase 2 — PWA shell & navigation (uses `pwa-ux-patterns.md`)
- Mobile bottom tab bar (Home / Summit / Network / Resources / Profile) with safe-area-inset and 44px+ targets.
- Desktop side drawer / top nav parity.
- `public/manifest.json` review: name, short_name, theme color `#0A1128`, icons, `display: standalone`.
- Install-prompt UX after 2 page views or 30s, dismissible, analytics events written to `pwa_analytics`.
- Honor the Lovable PWA caveats in the system prompt: register SW only in production, guard against iframe/preview hosts, NetworkFirst for HTML.

## Phase 3 — Motion layer (uses `motion-framer-patterns.md`)
- Install `framer-motion` if missing.
- Apply spring-based tab transitions, button tap scale, staggered card entrance to Hero/Stats/Partners/FAQ and Tracks grid.
- Bottom sheet primitive for registration step transitions; animated counter for Stats; skeleton shimmer for loading states.
- All animations gated by `useReducedMotion`.

## Phase 4 — Registration funnel hardening (uses `pwa-ux-patterns.md` + `modern-web-standards.md`)
- Confirm multi-step flow: Personal Info → Attendee Type → Track → Logistics → (no Payment — event is FREE; remove or hide `StepPayment` per brief Section 01).
- Zod schemas with length/format limits; autosave to localStorage via existing `lib/register/storage.ts`.
- Server function for insert; QR ticket + `.ics` download + WhatsApp share on confirmation screen.
- Live "X spots remaining" pulled from `stats` table.

## Phase 5 — Sponsor portal (uses brief Section 02 — Chidi)
- Tier comparison table, instant deck download (no email gate), inquiry form writing to `sponsor_inquiries`, success state with clear offline next steps.

## Phase 6 — Content hub (Schedule / Tracks / Speakers / FAQ)
- Static cached JSON for offline; container-query card layouts; SEO `head()` metadata per route (unique title/description, og:image only on leaf routes).

## Phase 7 — QA pass
- Mobile viewport (375px) walkthrough.
- Lighthouse PWA + a11y + perf checks.
- Verify all four docs' "DO/DON'T" rules satisfied; reduced-motion path; offline path; 44px targets; safe-area.

## What I'll ask before building
1. Which phase do you want first? (Recommend Phase 0 audit → Phase 1 tokens, since downstream work depends on them.)
2. Confirm: **registration is fully FREE** — remove `StepPayment` and Paystack code paths?
3. Confirm summit dates: brief says Sept 10–13 in one place and Sept 11–12 / Sept 11–14 elsewhere — which is canonical?

Once you pick the starting phase and answer the 3 questions, I'll switch to build mode and execute that phase only, then check back in.
