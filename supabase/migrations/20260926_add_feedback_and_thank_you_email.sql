-- Add thank_you_email_sent_at column to registrations
ALTER TABLE registrations
ADD COLUMN thank_you_email_sent_at TIMESTAMP WITH TIME ZONE;

-- Create summit_feedback table
CREATE TABLE summit_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  experience_rating INTEGER NOT NULL CHECK (experience_rating >= 1 AND experience_rating <= 5),
  join_yali_interest TEXT NOT NULL,
  preferred_state_hub TEXT,
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(registration_id)
);

-- Create index for feedback queries
CREATE INDEX idx_summit_feedback_registration_id ON summit_feedback(registration_id);
CREATE INDEX idx_summit_feedback_created_at ON summit_feedback(created_at DESC);

-- Create index for thank you email tracking
CREATE INDEX idx_registrations_thank_you_sent ON registrations(thank_you_email_sent_at DESC NULLS FIRST);
