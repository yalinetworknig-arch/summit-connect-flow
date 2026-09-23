-- Add nullable ticket_email_resent_at column to registrations table
-- Tracks when the corrected ticket confirmation email was resent to each registrant
-- Used to avoid double-sending and to identify who still needs the corrected email

ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS ticket_email_resent_at TIMESTAMPTZ DEFAULT NULL;

-- Index to efficiently find registrations awaiting resend
CREATE INDEX IF NOT EXISTS idx_registrations_ticket_email_resent_at
ON registrations(ticket_email_resent_at)
WHERE ticket_email_resent_at IS NULL;
