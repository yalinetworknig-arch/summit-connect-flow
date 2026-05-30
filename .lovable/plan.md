# Rewrite "Why Now" — research-backed, nuanced

You're right: the inflection point isn't 24 months away. It started in 2022–2024. The current copy oversells a deadline and undersells what's already on the ground. Here's the revised section.

## Scope

Only `src/components/sections/AboutSection.tsx` — the "Why now" block (lines ~62–88). Surrounding sections (hero stats, theme pillars, CTA) stay as-is.

## New copy

**Eyebrow:** Why now

**Headline:** The shift has already started. <span class="accent">The terms haven't been set.</span>

**Body (4 short paragraphs, scannable, with anchored facts):**

> Nigeria didn't wait for permission. The National AI Strategy was published in August 2024. The Data Protection Act has been law since July 2023. 3MTT has put 360,000+ Nigerians into technical training across all 774 LGAs, on the way to three million. Awarri shipped a government-backed LLM trained on Yoruba, Igbo, Hausa, Pidgin and Ibibio. OPay clears nine million transactions a day. The infrastructure is being poured.

> What's still open is who designs the building. Whose data trains the models. Whose languages they speak. Whose problems they solve first — and whose they ignore. Whose hands are on the policy pen when the next NDPA amendment or AI bill lands.

> That's why this room matters. Founders shipping product. Civil servants drafting policy. Educators reskilling at scale. Investors writing the cheques. Communities the technology is supposed to serve — in the room, not in the footnotes.

> What leaves the room: named commitments, working partnerships, and a 12-month follow-through plan owned by YALI Network Nigeria. Not a tote bag of slides.

**Optional footnote line under the block (small, muted):**
> Sources: FMCIDE National AI Strategy (2024) · NDPA 2023 · 3MTT programme data (FMCIDE, 2024) · DataReportal Digital Nigeria 2024 · Awarri / NITDA (2024).

## Why this is better

- **Honest timeline**: "already started" instead of "next 24 months will lock in everything" — your instinct is right, the lock-in is a slow rolling process, not a cliff.
- **Specific, citable**: every claim ties to a real artefact (NAIS doc, NDPA, 3MTT numbers, Awarri LLM, OPay scale) — defensible if a delegate Googles it.
- **Reframes "why now"** from urgency-by-deadline to urgency-by-agency: the question isn't *if* but *who shapes it*.
- **Keeps the closing beat** ("what leaves the room…") because that line is working — it's the summit's promise.

## Technical notes

Single-file edit in `AboutSection.tsx`. Markup stays the same (Reveal + Eyebrow + h3 + space-y-6 paragraph stack). The headline gets an `<span class="text-accent-cyan">` accent on the second clause to match the existing visual rhythm. The footnote uses `text-sm text-text-secondary/60 font-mono` to read as a citation, not body copy.

No new dependencies, no other files touched.

Approve and I'll apply it.
