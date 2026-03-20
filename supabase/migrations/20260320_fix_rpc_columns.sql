-- 1. Ensure new columns exist in profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS university TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS live_now BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS meeting_intent TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS meet_now_expiry TIMESTAMPTZ;

-- 2. Enhanced match_profiles function with full data returns and robustness boosts
DROP FUNCTION IF EXISTS match_profiles(vector, float, int);
DROP FUNCTION IF EXISTS match_profiles(vector, double precision, integer);

CREATE OR REPLACE FUNCTION match_profiles (
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  bio TEXT,
  hobbies TEXT[],
  skills TEXT[],
  study_window TEXT,
  peak_hours TEXT,
  academic_aim TEXT,
  avatar_url TEXT,
  instagram TEXT,
  discord TEXT,
  github_username TEXT,
  university TEXT,
  live_now BOOLEAN,
  meeting_intent TEXT,
  meet_now_expiry TIMESTAMPTZ,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    profiles.id,
    profiles.full_name,
    profiles.bio,
    profiles.hobbies,
    profiles.skills,
    profiles.study_window,
    profiles.peak_hours,
    profiles.academic_aim,
    profiles.avatar_url,
    profiles.instagram,
    profiles.discord,
    profiles.github_username,
    profiles.university,
    profiles.live_now,
    profiles.meeting_intent,
    profiles.meet_now_expiry,
    -- Apply a 0.1 boost if the user is live_now and session is NOT expired
    (1 - (profiles.embedding <=> query_embedding)) + 
    (CASE WHEN (profiles.live_now = true AND (profiles.meet_now_expiry IS NULL OR profiles.meet_now_expiry > now())) THEN 0.1 ELSE 0 END) AS similarity
  FROM profiles
  WHERE 1 - (profiles.embedding <=> query_embedding) > match_threshold
    -- Ensure we only consider live_now as TRUE if it hasn't expired
    AND (profiles.live_now = false OR profiles.meet_now_expiry IS NULL OR profiles.meet_now_expiry > now())
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
