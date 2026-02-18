-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  bio TEXT,
  hobbies TEXT[],
  study_window TEXT,
  peak_hours TEXT CHECK (peak_hours IN ('morning', 'night')),
  academic_aim TEXT,
  avatar_url TEXT,
  embedding VECTOR(768),
  theme_preference TEXT DEFAULT 'neutral',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing if they exist to avoid errors on retry
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Match profiles function
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
  study_window TEXT,
  peak_hours TEXT,
  academic_aim TEXT,
  avatar_url TEXT,
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
    profiles.study_window,
    profiles.peak_hours,
    profiles.academic_aim,
    profiles.avatar_url,
    1 - (profiles.embedding <=> query_embedding) AS similarity
  FROM profiles
  WHERE 1 - (profiles.embedding <=> query_embedding) > match_threshold
  ORDER BY profiles.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
