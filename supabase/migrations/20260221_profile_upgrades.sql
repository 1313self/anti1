-- Add skills and onboarding progress tracking to profiles
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS onboarding_step INT DEFAULT 1;
