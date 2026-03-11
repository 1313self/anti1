-- Add parent_id to lounge_messages for threading
ALTER TABLE public.lounge_messages 
    ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.lounge_messages(id) ON DELETE CASCADE;

-- Create index for faster thread retrieval
CREATE INDEX IF NOT EXISTS lounge_messages_parent_id_idx ON public.lounge_messages (parent_id);

-- Update RLS policies to ensure thread visibility (though existing policies for the table should cover general access)
-- The existing "Authenticated users can read messages" policy with USING (true) already allows reading all messages.
-- The existing "Users can insert own messages" policy with WITH CHECK (auth.uid() = user_id) allows users to reply.
