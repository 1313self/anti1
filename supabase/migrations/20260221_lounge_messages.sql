-- Create lounge_messages table for realtime chat
CREATE TABLE IF NOT EXISTS public.lounge_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL DEFAULT 'Anonymous',
    content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 500),
    channel TEXT NOT NULL DEFAULT 'general',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.lounge_messages ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read messages
CREATE POLICY "Authenticated users can read messages"
    ON public.lounge_messages FOR SELECT
    TO authenticated
    USING (true);

-- Users can only insert their own messages
CREATE POLICY "Users can insert own messages"
    ON public.lounge_messages FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own messages
CREATE POLICY "Users can delete own messages"
    ON public.lounge_messages FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Enable Realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.lounge_messages;

-- Index for fast chronological reads
CREATE INDEX lounge_messages_created_at_idx ON public.lounge_messages (created_at ASC);
