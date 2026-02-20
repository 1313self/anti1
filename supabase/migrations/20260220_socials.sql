-- Add social media columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS discord TEXT;

-- Comment on columns
COMMENT ON COLUMN public.profiles.instagram IS 'Optional Instagram handle or URL';
COMMENT ON COLUMN public.profiles.discord IS 'Optional Discord username or invite link';
