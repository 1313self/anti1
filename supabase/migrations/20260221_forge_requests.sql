-- Forge project join requests
CREATE TABLE IF NOT EXISTS public.forge_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (project_id, user_id)
);

ALTER TABLE public.forge_requests ENABLE ROW LEVEL SECURITY;

-- Requester can see their own requests
CREATE POLICY "Users can read own forge requests"
    ON public.forge_requests FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Requester can submit a request
CREATE POLICY "Users can insert forge requests"
    ON public.forge_requests FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Requester can withdraw their request
CREATE POLICY "Users can delete own forge requests"
    ON public.forge_requests FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE INDEX forge_requests_user_idx ON public.forge_requests (user_id);
CREATE INDEX forge_requests_project_idx ON public.forge_requests (project_id);
