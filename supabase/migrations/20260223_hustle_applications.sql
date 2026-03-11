-- Create hustle_applications table
CREATE TABLE IF NOT EXISTS public.hustle_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(gig_id, user_id) -- Prevent double applications
);

-- Enable RLS
ALTER TABLE public.hustle_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own applications
CREATE POLICY "Users can view own applications" 
ON public.hustle_applications FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Gig posters can view applications for their gigs
CREATE POLICY "Posters can view applications for their gigs" 
ON public.hustle_applications FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.gigs 
        WHERE id = hustle_applications.gig_id 
        AND posted_by = auth.uid()
    )
);

-- Policy: Users can insert their own applications
CREATE POLICY "Users can insert own applications" 
ON public.hustle_applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Gig posters can update status of applications for their gigs
CREATE POLICY "Posters can update application status" 
ON public.hustle_applications FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.gigs 
        WHERE id = hustle_applications.gig_id 
        AND posted_by = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.gigs 
        WHERE id = hustle_applications.gig_id 
        AND posted_by = auth.uid()
    )
);

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_hustle_apps_gig_id ON public.hustle_applications(gig_id);
CREATE INDEX IF NOT EXISTS idx_hustle_apps_user_id ON public.hustle_applications(user_id);
