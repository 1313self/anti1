-- Hustle gig bookmarks
CREATE TABLE IF NOT EXISTS public.hustle_bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, gig_id)
);

ALTER TABLE public.hustle_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookmarks"
    ON public.hustle_bookmarks FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
    ON public.hustle_bookmarks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
    ON public.hustle_bookmarks FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE INDEX hustle_bookmarks_user_idx ON public.hustle_bookmarks (user_id);
