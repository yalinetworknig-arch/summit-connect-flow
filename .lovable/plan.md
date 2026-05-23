## Goal
Make the AIDIFILN hero wordmark feel premium — glassmorphic / embossed, gently animated so it "pops" — and switch the countdown numbers to white so they read clearly on the navy hero.

## Changes

### 1. Hero wordmark (`src/components/home/Hero.tsx`)
Wrap the `<motion.img>` in a glass "plate" container:

- Container: rounded-2xl, `bg-white/5`, `backdrop-blur-xl`, `border border-white/15`, soft inner highlight via `ring-1 ring-inset ring-white/10`.
- Embossed depth: layered shadow — outer `shadow-[0_30px_80px_-20px_rgba(0,217,255,0.35)]` (cyan glow) + inset top highlight `inset 0 1px 0 rgba(255,255,255,0.25)` + inset bottom shadow `inset 0 -1px 0 rgba(0,0,0,0.4)`.
- Subtle conic / linear gradient sheen overlay (low opacity) sitting above the plate, below the image, to give the "glass" tilt.
- The PNG itself gets a soft drop-shadow filter so the rainbow letters lift off the plate.

Animation (framer-motion, GPU-friendly):
- Entrance: scale 0.92 → 1 + opacity 0 → 1, spring (stiffness 90, damping 14).
- Idle "float": continuous `y: [0, -6, 0]` over ~6s, easeInOut, infinite.
- Idle "breathe glow": animate shadow/opacity of an absolutely-positioned cyan halo behind the plate, 4s loop.
- Hover (desktop): `scale: 1.02` and brighter glow.
- Respect `prefers-reduced-motion` (disable the loops).

### 2. Countdown (`src/components/home/Countdown.tsx`)
- Change number color from `text-accent-cyan` to `text-white`.
- Change label color from `text-text-secondary` to `text-white/70` so labels still recede but stay readable on navy.
- Keep the cyan-tinted glass cell background; optionally bump border to `border-white/15` for consistency with the new wordmark plate.

### 3. No other components touched
Top nav, partners bar, side labels, halftone wave background — unchanged.

## Skills referenced
Pulling from the in-context guidance:
- `/motion-framer-skill` — spring entrance + infinite float/glow loops, reduced-motion guard.
- `/ui-ux-pro-max` & `/frontend-design` — glassmorphism recipe (translucent fill + blur + inset highlight + outer colored glow) and embossed depth via layered inset shadows.
- `/21st-dev` — composition pattern of a "plate" wrapping a brand mark with a halo layer behind.

## Out of scope
- No changes to the wordmark PNG itself.
- No new dependencies.
- No layout/section reorder.

Ready to switch to build mode and apply?
