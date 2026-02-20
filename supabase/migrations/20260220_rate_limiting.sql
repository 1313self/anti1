-- Add rate limiting columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS discovery_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_discovery_date DATE DEFAULT CURRENT_DATE;

-- Comment on columns
COMMENT ON COLUMN public.profiles.discovery_count IS 'Tracks daily Discovery Engine usage count';
COMMENT ON COLUMN public.profiles.last_discovery_date IS 'Tracks the last date Discovery Engine was used for resetting count';
