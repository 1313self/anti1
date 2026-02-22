-- Add file_url to resources table
ALTER TABLE resources ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Add description to gigs table
ALTER TABLE gigs ADD COLUMN IF NOT EXISTS description TEXT;

-- Create library_bookmarks table
CREATE TABLE IF NOT EXISTS library_bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

-- Enable RLS on library_bookmarks
ALTER TABLE library_bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can read their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON library_bookmarks
    FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own bookmarks
CREATE POLICY "Users can insert own bookmarks" ON library_bookmarks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON library_bookmarks
    FOR DELETE USING (auth.uid() = user_id);
