## Problem

At the tablet viewport (~768px) the marketing pages break in several ways. The clearest is About: the rotated `SideLabel` strips ("PRESENTS · AIDIFILN 2026" / "YALI NETWORK NIGERIA") activate at `md` (≥768px) and sit at `left-4 / right-4`, which collides directly with the headline because section padding is only `px-6` and the content max-width has no horizontal room left for them. The same primitive is reused on Tracks, Schedule and Sponsors, so the issue repeats.

Other tablet-range issues in the same files:
- Hero typography jumps straight from `text-4xl` to `text-6xl` with no `md` step, so headlines wrap awkwardly at 768.
- `HalftoneBackdrop` mask is tuned for wide hero, looks heavy and off-center at tablet width.
- Card grids use `md:grid-cols-2` / `md:grid-cols-3` / `lg:grid-cols-4` with `gap-5 md:gap-6`, but section padding stays `px-6`, leaving cramped gutters and cards that touch the viewport edge.
- Tracks card has a `text-[7rem]` number watermark that overflows the card at narrow widths.
- Contact form fields and Schedule day-tab row don't reflow cleanly at 768.

## Fix plan

Single pass, presentation-only edits. No business logic.

1. **`SideLabel` primitive** (`src/components/motion-primitives.tsx`)
   - Promote visibility breakpoint from `md:flex` to `xl:flex` (≥1280px) so labels only appear when the layout actually has room.
   - Move position to `xl:left-6 2xl:left-10` (and mirror on right) and add `max-w-[40vh]` so the rotated text can never overlap content.

2. **Section padding scale** (About, Tracks, Schedule, Sponsors, Contact heroes + content sections)
   - Change `px-6` → `px-5 sm:px-6 lg:px-8` and add a consistent `md:` step on hero type (`text-4xl md:text-5xl lg:text-6xl`) so the headline reflows cleanly at 768.
   - Tighten hero vertical rhythm at tablet: `py-20 md:py-24 lg:py-28`.

3. **Card grids**
   - About theme pillars and stat row: keep `sm:grid-cols-2 lg:grid-cols-4` but add `md:grid-cols-2` explicitly and bump gap at lg only.
   - Tracks: `grid-cols-1 lg:grid-cols-2` (was `md:grid-cols-2`) so each track card has full width at 768 and the long copy + sessions list breathe. Shrink the number watermark to `text-[5rem] md:text-[7rem]` and clamp with `overflow-hidden` already present.
   - Sponsors tier grids: add `md:` intermediate step where missing.

4. **Schedule**
   - Day tabs: make the tab row horizontally scrollable on narrow widths (`overflow-x-auto`, `snap-x`) so they never wrap into two lines at 768.
   - Session cards: stack time + title vertically below `md`, side-by-side from `md` up.

5. **Contact**
   - Form grid: `grid-cols-1 md:grid-cols-2` for name/email row; full-width for message. Ensure inputs have `min-h-12` for touch.
   - Contact info cards: single column under `md`, two columns from `md`.

6. **`HalftoneBackdrop`**
   - Soften mask on tablet: change `radial-gradient(ellipse 60% 50% ...)` to `radial-gradient(ellipse 80% 60% ...)` so the dot field doesn't bunch behind the headline at 768.

### Files touched

- `src/components/motion-primitives.tsx`
- `src/routes/about.tsx`
- `src/routes/tracks.tsx`
- `src/routes/schedule.tsx`
- `src/routes/sponsors.tsx`
- `src/routes/contact.tsx`

### Verification

After edits, screenshot About, Tracks, Schedule, Sponsors, Contact at 768×900 and 390×844 to confirm no overlap, no horizontal scroll, and headlines fit on two lines max.