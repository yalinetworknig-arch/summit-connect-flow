-- Migration: Add sector and attendance_mode columns
-- Created: 2026-09-12
-- Description: Replace track_selection with sector, add attendance_mode (physical/virtual)

-- Add sector column
ALTER TABLE registrations
  ADD COLUMN sector TEXT;

-- Add attendance_mode column with CHECK constraint
ALTER TABLE registrations
  ADD COLUMN attendance_mode TEXT CHECK (attendance_mode IN ('physical', 'virtual'));

-- Create indexes for filtering
CREATE INDEX idx_registrations_attendance_mode ON registrations(attendance_mode);
CREATE INDEX idx_registrations_sector ON registrations(sector);

-- Optional: Drop track_selection if no longer needed (uncomment when ready)
-- ALTER TABLE registrations DROP COLUMN track_selection;
