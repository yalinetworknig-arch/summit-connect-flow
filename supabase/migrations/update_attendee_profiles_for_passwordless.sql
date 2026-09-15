-- Passwordless attendee profiles: let a profile exist for a registrant who
-- never created a password account. Addressed by registration_id (reached
-- via their ticket_code) instead of requiring a Supabase Auth user_id.
-- Existing portal accounts (user_id set) are untouched — this is additive.
-- All passwordless reads/writes go through the service-role server
-- functions in src/lib/networking.functions.ts (same trust model already
-- used by saveContact/getAttendeeCard), so no RLS policy changes are
-- required — the existing "authenticated" policies keep working as-is for
-- the password-portal path.

-- 1. Give every row a stable id that isn't tied to auth.users, so it can be
--    the primary key regardless of whether user_id is present.
ALTER TABLE public.attendee_profiles
  ADD COLUMN IF NOT EXISTS id uuid NOT NULL DEFAULT gen_random_uuid();

-- 2. Swap the primary key from user_id -> id.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'attendee_profiles_pkey'
      AND conrelid = 'public.attendee_profiles'::regclass
  ) THEN
    ALTER TABLE public.attendee_profiles DROP CONSTRAINT attendee_profiles_pkey;
  END IF;
END$$;

ALTER TABLE public.attendee_profiles
  ADD CONSTRAINT attendee_profiles_pkey PRIMARY KEY (id);

-- 3. user_id becomes optional (passwordless rows have none), but stays
--    unique when present — Postgres allows multiple NULLs under a plain
--    UNIQUE constraint, so passwordless rows never collide with each other.
ALTER TABLE public.attendee_profiles ALTER COLUMN user_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'attendee_profiles_user_id_key'
      AND conrelid = 'public.attendee_profiles'::regclass
  ) THEN
    ALTER TABLE public.attendee_profiles
      ADD CONSTRAINT attendee_profiles_user_id_key UNIQUE (user_id);
  END IF;
END$$;

-- 4. Every profile must be reachable by at least one identity.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'attendee_profiles_has_owner'
      AND conrelid = 'public.attendee_profiles'::regclass
  ) THEN
    ALTER TABLE public.attendee_profiles
      ADD CONSTRAINT attendee_profiles_has_owner
      CHECK (user_id IS NOT NULL OR registration_id IS NOT NULL);
  END IF;
END$$;

COMMENT ON COLUMN public.attendee_profiles.user_id IS
  'Supabase Auth user id. NULL for attendees who never created a password account — those rows are reached via registration_id (their ticket_code) instead.';

-- registration_id already carries a UNIQUE constraint from the original
-- migration (20260531004524), so a passwordless row is uniquely addressable
-- by registration_id — and therefore by the registrant's ticket_code, one
-- join away via public.registrations.
