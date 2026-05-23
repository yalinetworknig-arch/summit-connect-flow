# Homepage Content + Registration Flow

This plan covers prompts 3–9 in one continuous build. Database already has `registrations` table with the right columns; no schema changes needed except adding a `payment_status` column for Paystack tracking.

## Prompt 3 — Hero (`src/components/home/Hero.tsx`)

- Full-viewport section (`min-h-[calc(100vh-4rem)]`), navy `--brand-navy` background.
- Hex pattern: inline SVG `<pattern>` repeated across an absolutely-positioned layer at `opacity: 0.1`.
- Stack: small kicker "YALI Network Nigeria National Summit" (Space Grotesk 700, clamp 32→64px) → AIDIFILN rainbow wordmark (clamp 48→96px, `.text-rainbow`) → tagline (Inter 400, 18px, max-w-2xl) → countdown → CTA pair.
- Countdown component (`Countdown.tsx`): pure client `useEffect` interval, target `new Date('2026-09-11T00:00:00+01:00')`. 4 boxes (Days/Hours/Minutes/Seconds), numbers 48px Space Grotesk, labels 14px uppercase tracking-wider. SSR-safe (render placeholders on first paint).
- CTAs: `<Link to="/register">` cyan pill (primary) + `<Link to="/sponsors">` outlined cyan (secondary).

## Prompt 4 — Stats (`src/components/home/Stats.tsx`)

- Section below hero, padded.
- 4 cards in `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`.
- Each card: `var(--surface)` bg, `var(--border-strong)` border, `rounded-xl shadow-md p-6`. Number 48px Space Grotesk cyan, label 14px text-secondary.
- Data: 740+ Attendees, 7 Sector Tracks, 4 Days of Innovation, 180+ Speakers (TBC).

## Prompt 5 — Partners (`src/components/home/Partners.tsx`)

- Heading "Partners From Our Previous Edition" (32px Space Grotesk 700, centered).
- Three labelled subsections: Title Sponsor (1), Key Sponsors (3), Partners (6).
- Each subsection uses `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` (Title Sponsor centered single column).
- Logo cell: 200×100 `<img>` from `via.placeholder.com/200x100?text=...`, `grayscale hover:grayscale-0 transition` with `loading="lazy"`.

## Prompt 6 — FAQ (`src/components/home/FAQ.tsx`)

- Uses existing shadcn `Accordion` from `@/components/ui/accordion`.
- 8 hard-coded Q&A entries (realistic answers, no Lorem).
- Style overrides: bottom border `var(--border-strong)`, `rounded-lg` items, cyan chevron via Tailwind `data-[state=open]:text-[var(--accent-cyan)]` on `AccordionTrigger`.

## Homepage composition (`src/routes/index.tsx`)

Replace placeholder with `<Hero /> <Stats /> <Partners /> <FAQ />` and route-level head meta describing the summit.

## Prompt 7+8 — Multi-step registration (`src/routes/register.tsx` + `src/components/register/`)

Folder layout:
```
src/components/register/
  ProgressIndicator.tsx   # 5-step pill row
  StepAttendeeType.tsx    # Step 1
  StepPersonalInfo.tsx    # Step 2
  StepTrack.tsx           # Step 3
  StepLogistics.tsx       # Step 4
  StepPayment.tsx         # Step 5
src/lib/register/
  schema.ts               # Zod schemas per step + full schema
  storage.ts              # load/save formState to localStorage
  tracks.ts               # 7 track definitions (slug, title, description, icon)
  states.ts               # 36 Nigerian states + FCT
```

- Single parent component holds `formState`, `currentStep`, autosaves to `localStorage` key `yali-reg-draft` on every change.
- Per-step Zod validation gates "Next". Errors render inline below each field.
- All inputs: shadcn `Input` / `Select` / `Checkbox` / `Textarea` / `RadioGroup`, themed via tokens; focus uses `focus-visible:ring-2 focus-visible:ring-[var(--accent-cyan)]`.
- Step 1: 4 radio cards (lucide icons: GraduationCap, Building2, Newspaper, Users).
- Step 2: name/email/phone/state; YALI ID input shows only if `attendee_type === "delegate"` (DB trigger enforces it server-side too).
- Step 3: 7 track cards; selected one expands description; stores `track_selection`.
- Step 4: two checkboxes + dietary textarea (max 500 chars).
- Step 5: pricing logic — `new Date() < 2026-07-01` ⇒ ₦15,000 early bird, else ₦20,000. Paystack inline button via `@paystack/inline-js` (will need `bun add @paystack/inline-js`). Public key from `VITE_PAYSTACK_PUBLIC_KEY`. On `success` callback, call server fn `submitRegistration` which inserts into `registrations` via `supabaseAdmin` (anon insert policy already exists, but using a server fn lets us also persist a `paystack_reference` and return the inserted row).

### Server function (`src/lib/registrations.functions.ts`)

```ts
submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((input) => fullRegistrationSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("registrations").insert(data).select().single();
    if (error) throw new Error(error.message);
    return row; // includes ticket_code + id
  });
```

### Tiny migration

Add columns to `registrations` for payment tracking:
```sql
ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS paystack_reference text,
  ADD COLUMN IF NOT EXISTS amount_kobo integer,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending';
```

### Secret needed

`VITE_PAYSTACK_PUBLIC_KEY` (publishable, safe in client). User will be prompted to add it.

## Prompt 9 — Confirmation (`src/routes/register.$id.tsx`)

- New dynamic route. Loads registration by id via server fn `getRegistrationById` (returns only safe fields: full_name, email, ticket_code, track_selection, attendee_type, created_at).
- Renders:
  - Success banner with checkmark.
  - QR code generated client-side via `qrcode` package (`bun add qrcode`), encoding `${origin}/register/${id}` plus ticket_code.
  - "Download .ics" button — builds an ICS string in-memory for Sept 11–12, 2026 at "Lagos, Nigeria" and triggers download via Blob.
  - "Share on WhatsApp" link `https://wa.me/?text=` + `encodeURIComponent("I just registered for YALI Summit 2026! Join me at <url>")`, opens in new tab.
  - Link back to homepage.
- After successful Paystack callback in Step 5, navigate via `useNavigate` to `/register/${row.id}`.

## Quality gates I'll verify before finishing

- Responsive at 375 / 768 / 1024 / 1440 (mobile-first classes throughout).
- Hero contrast: cyan on navy ≈ 11.7:1, white on navy ≈ 16:1, both pass AA.
- Countdown SSR-safe (no hydration mismatch).
- All Zod errors surface inline; "Next"/"Submit" buttons disabled while invalid.
- All external links (Paystack, WhatsApp, social, placeholders) use `target="_blank" rel="noopener noreferrer"` where appropriate.
- No console errors after navigating Home → Register → through all 5 steps (with Paystack key absent it falls back to a disabled button with a clear message instead of crashing).
- Build passes.

## Decisions I'm making by default (tell me to change before I start)

1. **Paystack integration**: I'll use the official `@paystack/inline-js` SDK and require you to add `VITE_PAYSTACK_PUBLIC_KEY` as a secret. If you don't have a Paystack account yet, say so and I'll stub Step 5 to a "Payment coming soon — click to register without payment" button that still writes the registration.
2. **Placeholder logos**: I'll use `via.placeholder.com` URLs labelled with sponsor names. Swap to real assets later by replacing the URL strings in `Partners.tsx`.
3. **Hex pattern**: subtle inline SVG, no extra asset file.
4. **Confirmation route path**: `/register/$id` (not a separate `/confirmation` page) so links are shareable and idempotent.

Confirm and I'll execute end-to-end.
