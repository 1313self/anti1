-- Lounge message emoji reactions
CREATE TABLE IF NOT EXISTS public.lounge_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID NOT NULL REFERENCES public.lounge_messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji TEXT NOT NULL CHECK (emoji IN ('👍','❤️','😂','🔥','💡')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (message_id, user_id, emoji)
);

ALTER TABLE public.lounge_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read reactions"
    ON public.lounge_reactions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can insert own reactions"
    ON public.lounge_reactions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
    ON public.lounge_reactions FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.lounge_reactions;

CREATE INDEX lounge_reactions_message_idx ON public.lounge_reactions (message_id);
