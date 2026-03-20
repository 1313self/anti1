-- Add GitHub Username and University to profiles for professional verification
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university TEXT;

-- Index for searching (optional but good for future matching)
CREATE INDEX IF NOT EXISTS idx_profiles_university ON public.profiles(university);
