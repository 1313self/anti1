-- Update match_profiles function to include skills
-- Drop first to allow return type change
DROP FUNCTION IF EXISTS match_profiles(vector, float, int);

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
    1 - (profiles.embedding <=> query_embedding) AS similarity
  FROM profiles
  WHERE 1 - (profiles.embedding <=> query_embedding) > match_threshold
  ORDER BY profiles.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
