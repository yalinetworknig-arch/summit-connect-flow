-- Remove the trigger that enforces yali_id for delegates
DROP TRIGGER IF EXISTS trg_registrations_delegate_yali_id ON public.registrations;

-- Remove the function that enforces the constraint
DROP FUNCTION IF EXISTS public.enforce_delegate_yali_id();

-- Now yali_id is optional for all attendee types
