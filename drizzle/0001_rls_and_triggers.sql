-- Run this in Supabase SQL Editor after the schema migration

-- Index for fast message lookups
CREATE INDEX IF NOT EXISTS messages_conversation_created_idx ON messages (conversation_id, created_at);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE soul_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE zanpakuto ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE canon_bankai ENABLE ROW LEVEL SECURITY;

-- profiles: users can only read/write their own row
CREATE POLICY "profiles_self" ON profiles
  FOR ALL USING (auth.uid() = user_id);

-- soul_readings: users can only read/write their own row
CREATE POLICY "soul_readings_self" ON soul_readings
  FOR ALL USING (auth.uid() = user_id);

-- zanpakuto: users can only read/write their own row
CREATE POLICY "zanpakuto_self" ON zanpakuto
  FOR ALL USING (auth.uid() = user_id);

-- conversations: users can only read/write their own rows
CREATE POLICY "conversations_self" ON conversations
  FOR ALL USING (auth.uid() = user_id);

-- messages: users can access messages in their own conversations
CREATE POLICY "messages_self" ON messages
  FOR ALL USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

-- share_cards: public read if zanpakuto owner has opted in; owner can write
CREATE POLICY "share_cards_public_read" ON share_cards
  FOR SELECT USING (
    zanpakuto_id IN (
      SELECT id FROM zanpakuto WHERE user_id IN (
        SELECT user_id FROM profiles WHERE public_opt_in = true
      )
    )
  );

CREATE POLICY "share_cards_self_write" ON share_cards
  FOR ALL USING (
    zanpakuto_id IN (SELECT id FROM zanpakuto WHERE user_id = auth.uid())
  );

-- canon_bankai: public read only
CREATE POLICY "canon_bankai_public_read" ON canon_bankai
  FOR SELECT USING (true);

-- Auto-create profile row when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
