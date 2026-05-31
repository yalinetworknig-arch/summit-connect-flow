
## Reassessment of the current landing page

What's already strong:
- Hero is bold, typographic, has motion, hexagon halftone backdrop, AIDIFILN wordmark.
- Strong content density: About, Why-now, Pillars, 4-day Schedule, 7 Tracks, Sponsor tiers + form, Partners carousel, State Hubs marquee, FAQ, Contact.
- Consistent design tokens (cyan accent on navy/surface), motion-primitives system.

What's missing (your instinct is right):
- **Zero human imagery.** Everything is text + icons + motion graphics. For a *people* summit ("inclusive leadership"), this reads cold. The reference flyer leaned on portraits + scene photography for emotional weight.
- No sense of *place* (Lagos / Nigeria) and no sense of *audience* (the YALI delegates we're recruiting).
- Long text blocks in About / Why-now with no visual relief — high scroll fatigue on mobile (428px viewport).
- Sponsor + Tracks sections feel like a brochure, not a movement.

## Image strategy (the important part)

Per your direction — **no random AI images.** Imagery will be sourced from curated, license-clear real photography that actually depicts our audience and theme. Sourcing tiers, in order of preference:

1. **YALI Network Nigeria's own archive** — photos from previous editions, hub events, delegate sessions. *(You provide; I'll wire them in.)*
2. **Curated free-license libraries** filtered for Nigerian / African civic, tech, and leadership scenes:
   - Nappy.co (Black-creator stock, free commercial use)
   - Unsplash + Pexels (filtered: "Lagos", "African tech", "African women leaders", "African classroom", "African conference")
   - WOCinTech Chat collection (women of colour in tech)
   - U.S. State Dept / U.S. Mission Nigeria public-domain Flickr (YALI events)
3. **Targeted AI generation** as a last resort only for stylized abstract textures (never people), with explicit art direction matched to the navy/cyan palette.

Selection rules (Pro-Max guardrails):
- People in frame must be African / Nigerian — never generic Western stock.
- Real moments only (panels, workshops, hubs, fieldwork, classrooms, market tech) — no posed corporate handshakes.
- Cool/neutral color grade compatible with `#0A1128` navy + `#00D9FF` cyan; a duotone/cyan overlay applied programmatically for tonal consistency.
- 16:9 hero crops, 4:5 portrait crops, 1:1 tile crops — same source reframed per breakpoint.
- All `<img>` with `loading="lazy"`, `decoding="async"`, explicit `width`/`height`, `srcset` for 1x/2x, WebP, and meaningful `alt` text.

## Where images go (section by section)

```
Hero
  └─ Add: subtle background portrait collage (3 cropped delegate portraits)
          behind the halftone wave, ~12% opacity, cyan duotone — sense of
          "real people behind this summit" without competing with the wordmark.

About / "Inclusive leadership is the work"
  └─ Add: full-bleed editorial photo break BETWEEN the eyebrow intro and the
          4 fact cards. One strong image of a Nigerian civic gathering /
          workshop. Aspect 21:9 desktop, 4:3 mobile.

Why this, why now (long text block)
  └─ Add: 2 inline images interleaved with the 4 paragraphs (right-aligned
          on desktop, stacked above paragraph on mobile). One classroom/3MTT
          training scene, one fintech/mobile-money street scene. Breaks the
          wall of text.

Theme pillars (3 cards)
  └─ Add: small 1:1 photo header to each card (32% card height), cyan duotone.
          People > icons. Keeps icon as small overlay badge bottom-left.

Schedule
  └─ Add: one wide hero image above the day-tabs (a panel/audience shot)
          with the day theme overlaid. Subtle parallax on desktop only.

Tracks (7 sector cards)
  └─ Add: a sector-specific image header per card (health → clinic; education
          → classroom; agri → farm; governance → civic hall; etc.). 16:9 top
          of card, cyan duotone, sector icon stays as overlay chip.

Sponsors
  └─ Add: editorial "impact strip" — 3-up image montage above tier cards
          (delegates + sponsor activation + national press) with stat
          overlays ("700+ delegates · 36 states · 7 sectors").

State Hubs (already has logos)
  └─ Keep as-is. Logos are the right call here.

CTA blocks
  └─ Add: faint background portrait + heavy navy gradient on the closing
          "Take a seat at the table" band.
```

## Technical plan

1. **New asset directory** `src/assets/editorial/` with sub-folders by section. WebP only, two sizes (`-w1600.webp`, `-w800.webp`).
2. **New `<EditorialImage />` component** in `src/components/editorial/EditorialImage.tsx`:
   - Props: `src`, `srcSmall`, `alt`, `aspect`, `duotone?: boolean`, `priority?: boolean`.
   - Renders `<picture>` with `srcset`, applies CSS cyan-duotone via `mix-blend-mode: luminosity` + cyan tint layer when `duotone` is on.
   - Built-in skeleton + fade-in (respects `prefers-reduced-motion`).
3. **New `<ImageBreak />` section component** for full-bleed editorial photo breaks between text sections.
4. **Update the 6 sections above** to slot in `<EditorialImage />` / `<ImageBreak />` per the map.
5. **No business logic changes** — purely presentational additions.

## Open question (before I build)

**Where should the images come from for this first pass?**
- **A.** You'll send me 8–15 real photos from previous YALI editions / hubs (best outcome — authentic, on-brand). I'll wire them in.
- **B.** Start now with hand-picked free-license photos from Nappy.co / Unsplash matching the brief, and swap in your archive when you have it ready.
- **C.** Mix: use your archive for hero + sponsor strip; use curated free-license for track headers + inline breaks.

I'd recommend **C** unless you can drop a folder right now — it gets the page looking right today and leaves the most "personal" slots (hero, sponsor montage) for your own photography when it lands.

## Out of scope for this plan

- Speaker portraits section (will need real headshots + bios — separate task once lineup is confirmed).
- Photo gallery / media kit page.
- CMS for swapping images without redeploy.
