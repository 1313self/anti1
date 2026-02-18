-- Create resources table for the Library
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Notes', 'Guide', 'Lecture', etc.
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT, -- Fallback name for display
    university TEXT,
    tags TEXT[],
    downloads INTEGER DEFAULT 0,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create gigs table for the Hustle
CREATE TABLE IF NOT EXISTS public.gigs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Remote', 'On-campus', etc.
    compensation TEXT,
    deadline TEXT,
    hot BOOLEAN DEFAULT false,
    tags TEXT[],
    posted_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create projects table for the Forge
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    lead_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    vision TEXT,
    needs TEXT[],
    members_count INTEGER DEFAULT 1,
    status TEXT DEFAULT 'Recruiting',
    type TEXT DEFAULT 'Software',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Select policies (everyone can view)
CREATE POLICY "Public can view resources" ON public.resources FOR SELECT USING (true);
CREATE POLICY "Public can view gigs" ON public.gigs FOR SELECT USING (true);
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);

-- Authenticated users can create
CREATE POLICY "Users can create resources" ON public.resources FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create gigs" ON public.gigs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Users can create projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
