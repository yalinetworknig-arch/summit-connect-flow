## Goal
Remove the blurry glass plate around the AIDIFILN wordmark. Keep the wordmark crisp and still feel premium and animated — no frosted container behind it.

## Change (one file: `src/components/home/Hero.tsx`)

Strip the glass plate wrapper. Render the PNG directly on the hero background, lifted by light/shadow instead of a panel.

Specifically:
- Remove the `bg-white/[0.06] backdrop-blur-xl border` plate div, the top sheen, and the diagonal sheen overlay.
- Keep the entrance animation (spring scale 0.92 → 1) and the gentle infinite `y: [0, -6, 0]` float on the image itself.
- Keep a soft cyan halo behind the wordmark, but tighter and lower opacity so it reads as "glow" not "fog":
  - radial cyan→transparent, ~20% opacity, blur ~32px, sits behind the image, breathes between 0.35 and 0.7 opacity.
- Apply a layered `drop-shadow` filter on the image so the rainbow letters get embossed depth without a panel:
  - `drop-shadow(0 2px 0 rgba(255,255,255,0.15))` top highlight
  - `drop-shadow(0 12px 24px rgba(0,0,0,0.55))` grounding shadow
  - `drop-shadow(0 0 28px rgba(0,217,255,0.35))` cyan glow
- Hover: subtle `scale: 1.015`, brighten the halo.
- Respect `prefers-reduced-motion` (disable the float and halo pulse).

## Out of scope
- No changes to the wordmark image, countdown, nav, partners bar, or background halftone wave.
- No new dependencies.

Ready to switch to build mode?
