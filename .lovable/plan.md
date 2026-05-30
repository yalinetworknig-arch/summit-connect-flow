## Batch 2: 10 more YALI State Hub logos

Wire the new uploads into `src/components/home/StateHubs.tsx` and polish how every hub logo card presents on the homepage carousel.

### Logos to add (10)
Nasarawa, Kwara, Abia, Kogi, Sokoto, Cross River, Oyo, Osun, Ekiti, Ondo.

Combined with batch 1, that brings real logos to **19 of 37** hubs. The remaining 18 keep monogram fallbacks until you send them.

### Steps

1. Copy each upload to `src/assets/hubs/<state>.jpeg`.
2. Import in `StateHubs.tsx` and attach `logo:` on the matching `Hub` row.
3. Polish the carousel card to make the logos look premium (UI/UX Pro Max pass):
   - Larger logo well (64 → 80px on mobile, 96px on desktop) so the artwork reads at a glance.
   - White inner disc with soft inner ring + subtle elevation shadow (token-based, no hard borders).
   - `object-contain` with safe padding (logos have circular bleed — `cover` clips the "YALI NETWORK <STATE>" wordmark on some).
   - Quiet hover: lift + ring glow in brand teal, no scale jitter.
   - Larger dialog logo (112px) and consistent treatment.
   - Keep monogram fallback for hubs without a logo, restyled to match the new well.

### Out of scope
- No new section, no footer changes, no copy edits.
- No backend or data changes.
- Remaining 18 hub logos — send when ready.
