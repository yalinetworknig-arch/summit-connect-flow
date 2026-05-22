# Supabase Schema — YALI Summit 2026 (Phase 1)

Create the database foundation. No UI, no PWA setup yet.

## Tables

**1. `registrations`** — FREE event signups (no payment fields)
- `id` uuid PK (gen_random_uuid)
- `created_at` timestamptz default now()
- `attendee_type` text — CHECK in ('delegate','sponsor_rep','media','general')
- `full_name` text NOT NULL
- `email` text NOT NULL UNIQUE
- `phone` text NOT NULL — CHECK regex `^\+234[0-9]{10}$`
- `state` text NOT NULL — CHECK in (36 states + FCT)
- `yali_id` text nullable
- `track_selection` text — CHECK in ('healthtech','agritech','edtech','govtech','fintech','climatetech','socialimpact')
- `accommodation_needed` boolean default false
- `travel_support_needed` boolean default false
- `dietary_restrictions` text nullable
- `heard_about_summit` text nullable
- `ticket_code` text UNIQUE NOT NULL (default gen_random_uuid()::text)
- `email_confirmed` boolean default false
- `whatsapp_notified` boolean default false
- `calendar_downloaded` boolean default false
- `pwa_installed` boolean default false
- Trigger: enforce `yali_id NOT NULL` when `attendee_type = 'delegate'`

**2. `sponsor_inquiries`**
- id, created_at
- company_name, contact_name, email, phone (all text NOT NULL)
- `budget_range` CHECK in ('under_1m','1m_5m','5m_10m','10m_20m','above_20m')
- `preferred_tier` CHECK in ('title','gold','silver','bronze','undecided')
- `goals` text NOT NULL
- `decision_timeline` CHECK in ('within_1_week','within_2_weeks','within_1_month','flexible')
- `status` CHECK in ('new','contacted','meeting_scheduled','proposal_sent','closed') default 'new'
- assigned_to, notes (nullable)

**3. `contact_submissions`**
- id, created_at
- name, email, subject, message (text, required)
- status text default 'new'

**4. `stats`** — homepage counters (registrations count, days-to-summit, etc.)
- id, key text UNIQUE, value integer, updated_at

**5. `pwa_analytics`** — install/engagement events
- id, created_at
- event_type text — CHECK in ('install_prompted','install_accepted','install_dismissed','offline_view','push_subscribed','sw_activated')
- session_id text, user_agent text, platform text, path text (all nullable)
- metadata jsonb default '{}'

## RLS Strategy

All tables: RLS enabled.
- `registrations`, `sponsor_inquiries`, `contact_submissions`, `pwa_analytics`: public INSERT allowed (anon), SELECT denied (admin only via service role).
- `stats`: public SELECT allowed, no public writes.

This keeps the form-submit flow working without auth in Phase 1 while preventing data exfiltration. No SELECT policy on PII tables means lists/dashboards must go through server functions using `supabaseAdmin`.

## Indexes
- `registrations(email)`, `registrations(ticket_code)`, `registrations(attendee_type)`
- `sponsor_inquiries(status)`, `sponsor_inquiries(created_at desc)`
- `pwa_analytics(event_type, created_at desc)`

## Out of scope (next prompts)
- PWA manifest / service worker
- Bottom-nav UI
- Registration / sponsor forms
- Auth (Phase 1 has none)

After you approve, I'll run the migration in one step and stop for confirmation before any UI work.
