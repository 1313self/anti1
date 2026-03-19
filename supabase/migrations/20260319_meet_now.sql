-- Add meeting intent and availability for Flash Networking
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS meeting_intent TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS meet_now_expiry TIMESTAMPTZ DEFAULT NULL;

-- Keep live_now for binary availability, but we can now filter by intent
COMMENT ON COLUMN profiles.meeting_intent IS 'Intent for meeting: coffee, brainstorm, help, etc.';
