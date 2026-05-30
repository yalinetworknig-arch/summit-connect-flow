## Goal

Rewrite every customer-facing string across the marketing funnel as a senior UX writer + landing-page copy lead would — voice-led, scannable, and engineered to move the visitor through a single narrative arc: **Tension → Stakes → Promise → Proof → Action**.

No layout, component or routing changes. Copy + microcopy only.

## Voice & narrative system (applied everywhere)

- **Voice**: Direct, plainspoken, confident. Short sentences. Active verbs. Sentence-case headings (no Title Case). One idea per line. No hype words ("revolutionary", "world-class", "unleash"), no AI-template clichés ("In today's fast-paced world…").
- **POV**: "You" for the visitor, "we" for the host, "Nigeria" as the protagonist. Numbers always win over adjectives.
- **Funnel arc** repeated at three scales (home, page, section):
  1. **Hook** — name the tension in one line.
  2. **Stakes** — why this moment, why this room.
  3. **Promise** — what changes if you show up.
  4. **Proof** — dates, numbers, names, tracks.
  5. **Action** — one primary CTA, one secondary.

## Inconsistencies to fix first (factual, blocks credibility)

- Dates: Hero/About say **Sept 10–13, 2026**; FAQ says **Sept 11–14**. → Lock to **Sept 10–13, 2026**.
- Attendees: Home Stats says **740+**, About/Sponsors say **2,000+**. → Lock to **2,000+ expected**.
- "Speakers (TBC)" 180+ is a weak proof point — replace with a real, ownable number ("36 states + FCT represented" or "60+ confirmed speakers").
- Venue: only FAQ mentions Eko Convention Centre — surface it earlier (About + Schedule hero).

## Page-by-page rewrite (only the strings change)

### 1. Hero (`src/components/home/Hero.tsx`)

- Replace the bare "Presents:" / "Theme:" eyebrow stack with a tighter intro line that earns attention before the wordmark.
- Add a one-line **promise** above the CTAs: "Four days. Seven sectors. One inclusive AI future for Nigeria."
- CTA copy: `Register Now` → **"Claim your seat"**, `Become a Sponsor` → **"Partner with us"**.
- Replace the empty `&nbsp;` line under CTAs with a **trust line**: "Free for verified YALI delegates · 2,000+ expected · Lagos, Sept 10–13, 2026".

### 2. Stats (`src/components/home/Stats.tsx`)

Rewrite with concrete, defensible numbers and labels that *say something*:

- `2,000+` — Delegates expected
- `7` — Sector tracks shaping policy
- `4 days` — Keynotes, workshops, hackathon
- `36 + FCT` — States represented

### 3. Home section intros (`src/routes/index.tsx`)

- Schedule preview: eyebrow `Sept 10 – 13, 2026` → keep; headline "Four days, one mission." → **"Four days. Built to ship outcomes, not slides."**
- Tracks preview: headline "Pick the room you want to shape." → keep (strong), but rewrite eyebrow to `Seven rooms · Seven decisions` and add a one-line sub: "Each track ends with named commitments, not closing remarks."

### 4. About (`src/routes/about.tsx`)

- Eyebrow: `About the summit` → keep.
- H1 stays (it's the theme).
- Lede rewrite: replace the current paragraph with a 2-sentence hook + stakes:
  > "Nigeria's AI decade has already started. AIDIFILN is where the people building it — founders, policymakers, educators, sponsors — meet to align on what 'inclusive' actually means in code, policy and capital."
- Stat row labels tightened ("Dates / Location / Delegates / Reach" → keep, refine `Reach` value to "All 36 states + FCT").
- "Why now" section: replace both paragraphs with a tighter 3-beat (the 24 months stake → who's in the room → what leaves the room).
- "Theme pillars" bodies rewritten to be punchier and parallel in cadence.
- Final CTA: "Be part of it." → **"Take a seat at the table."** Sub: "Registration is open. Verified YALI delegates attend free."

### 5. Tracks (`src/routes/tracks.tsx` + `src/lib/event-data.ts`)

- Hero sub rewritten to a single promise line: "Seven sector rooms. Each one ends with named commitments — not closing remarks."
- For every track in `TRACK_DETAILS`, rewrite `long` to a 2-sentence pattern: **(tension line) + (what this room produces)**. Keep `sessions` titles but tighten 1–2 of them for parallel verb structure.
- CTA on each card: "Register for this track" → **"Hold a seat in this room"**.

### 6. Schedule (`src/routes/schedule.tsx` + `SCHEDULE` data)

- Hero H1 "The full programme." → **"The four days, hour by hour."**
- Hero sub rewritten to set expectations and name the venue.
- Each day's `theme` rewritten as a verb-led promise (e.g. Day 1 "Arrivals & Opening Ceremony" → **"Open the room"**, Day 2 → **"Go deep, by sector"**, Day 3 → **"Build, hack, celebrate"**, Day 4 → **"Commit and ship"**).
- Block `description`s tightened — strip filler, lead with what the delegate gets.
- Final CTA "Reserve your seat" → **"Claim your seat"** (match hero copy verb).

### 7. Sponsors (`src/routes/sponsors.tsx` + `SPONSOR_TIERS`)

- Hero H1 stays. Sub rewritten as benefit-first proof: "2,000+ delegates from all 36 states. 7 sector rooms. National + diplomatic press. Pick a tier — or tell us the outcome you want and we'll build the package."
- Inquiry section H2: "Tell us what you want to build with us." → keep, strong.
- Inquiry sub-line rewritten to set response expectation and friction: "Three minutes to fill. 48 hours to a human reply. No deck downloads required."
- Tier benefit bullets rewritten for **outcome verbs** (e.g. "Logo on website & event signage" → "Your logo on every stage, badge and livestream lower-third"). Each tier opens with a one-line positioning sentence above the bullets.
- Submit button "Submit inquiry" → **"Start the conversation"**.

### 8. Contact (`src/routes/contact.tsx`)

- H1: "We'd love to hear from you." → **"Talk to a real human, fast."**
- Sub: rewritten to triage the visitor: "Registration questions, sponsorship, media accreditation, partnerships — pick one below and we'll route it the same day."
- Info card values get plain microcopy hints (e.g. under Email: "Replies within 2 business days.").
- Submit button: "Send message" → **"Send it over"**.
- Success state: "Thanks for reaching out — we'll reply within 2 business days." → **"Got it. A real person will reply within 2 business days."**

### 9. FAQ (`src/components/home/FAQ.tsx`)

- Fix the Sept 11–14 → **Sept 10–13** date error.
- Rewrite all 8 Q&A pairs in the same voice — Qs as the visitor would actually type them, As that lead with the answer in the first 6 words.
- Add 2 new Qs that the funnel currently leaves open: **"Can I attend if I'm not a YALI member?"** and **"What do I leave with?"**

### 10. Register flow microcopy (light pass)

- Step titles, helper text under inputs, and the final success screen rewritten in the same voice. No field changes, no validation changes — only the human-readable strings. This is the highest-friction surface in the funnel, so the polish lands hardest here.

## Out of scope

- No layout, component, route, schema, or data-shape changes.
- No imagery, color, font, or motion changes.
- No SEO meta rewrites in this pass (separate concern — flag for a follow-up if you want it).

## Files touched (strings only)

`src/components/home/Hero.tsx`, `src/components/home/Stats.tsx`, `src/components/home/FAQ.tsx`, `src/routes/index.tsx`, `src/routes/about.tsx`, `src/routes/tracks.tsx`, `src/routes/schedule.tsx`, `src/routes/sponsors.tsx`, `src/routes/contact.tsx`, `src/lib/event-data.ts`, `src/components/register/*.tsx`.

## Verification

After edits: re-read the home page top-to-bottom as a first-time visitor and confirm the five-beat arc (Hook → Stakes → Promise → Proof → Action) reads cleanly without scrolling fatigue. Spot-check Schedule, Tracks, Sponsors and Contact for date consistency (Sept 10–13) and attendee consistency (2,000+).