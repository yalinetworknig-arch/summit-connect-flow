# App Shell Alignment Plan

The current shell is close but doesn't match this spec. This plan reconciles them without building any page content.

## 1. Design tokens (`src/styles.css`)

Add the missing brand tokens alongside existing ones (both `:root` light and `.dark`):
- `--border-dark: #2A3447`, `--border-light: #E4E7EB`
- `--surface-light: #F8FAFB` (already present), confirm `--surface` dark = `#141B2D`
- `--text-primary-light/dark`, `--text-secondary-light/dark` (already present, rename-map if needed)
- `--error: #EF4444` (currently only `--destructive`)
- Keep existing `--success`, `--warning`, `--accent-cyan`, rainbow `.text-rainbow` class
- Google Fonts `@import` already present — keep as is

## 2. Routes

Currently exist: `/`, `/summit`, `/schedule`, `/network`, `/sponsors`, `/profile`, `/register`.

Spec requires: `/`, `/register`, `/sponsors`, `/about`, `/schedule`, `/tracks`, `/contact`.

Actions:
- Create new route files: `src/routes/about.tsx`, `src/routes/tracks.tsx`, `src/routes/contact.tsx` — each a placeholder `<h1>` shell with route-specific `head()` meta.
- Leave `summit.tsx`, `network.tsx`, `profile.tsx` in place (used by prior PWA bottom tab work) but not linked from the new top nav. Decision needed — see question below.

## 3. Top navigation (`src/components/TopNav.tsx`)

Rewrite to match spec:
- Sticky top bar, always visible (mobile + desktop), not `hidden md:flex`.
- Left: `AIDIFILN` wordmark using `.text-rainbow`.
- Center (desktop ≥ md): Home, About, Schedule, Tracks, Sponsors, Contact with active styles.
- Right (desktop): theme toggle (Sun/Moon) + `Register` button + `Sponsor` button.
- Mobile (< md): hamburger (`Menu` icon) opens shadcn `Sheet` (side="right", full-height overlay) containing the same nav items stacked + both CTAs + theme toggle.
- Theme toggle persists choice to `localStorage` and reads `prefers-color-scheme` on first load (default dark).

## 4. Footer (`src/components/Footer.tsx`, new)

- 3-column grid on desktop, single column on mobile.
- Col 1: AIDIFILN logo + tagline.
- Col 2: Quick Links (same 6 nav items as `Link`s).
- Col 3: Contact email + phone + social row (Facebook, Twitter, Linkedin, Instagram from `lucide-react`), all `target="_blank" rel="noopener noreferrer"`.
- Bottom bar: copyright + Privacy Policy link.

## 5. AppShell (`src/components/AppShell.tsx`)

- Render `<TopNav />`, `<main><Outlet /></main>`, `<Footer />`.
- Remove `BottomTabBar` from the layout (spec uses hamburger Sheet for mobile, not bottom tabs). Decision needed — see question below.
- Adjust `main` padding for fixed top nav (`pt-16`) and no longer reserve bottom space.

## 6. Quality gates (verified manually after build)

- Responsive check at 375/768/1024/1440 in preview.
- Contrast: cyan (#00D9FF) on navy (#0A1128) ≈ 11.7:1 passes AA.
- All external/social links use `target="_blank" rel="noopener noreferrer"`.
- Theme toggle round-trips between light/dark and persists.
- Sheet open/close on mobile.

## Open questions before I implement

1. **Keep or remove the mobile `BottomTabBar`?** The previous PWA prompt added it; this prompt's nav spec replaces mobile nav with a hamburger Sheet. I'll remove `BottomTabBar` from `AppShell` unless you want both.
2. **Keep `/summit`, `/network`, `/profile` route files?** They're not in this spec's nav. I'll leave the files (no link to them) so PWA work isn't lost, unless you want them deleted.

Confirm or answer the two questions and I'll implement.
