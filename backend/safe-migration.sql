-- LingoFlux Safe Migration
-- Uses IF NOT EXISTS to handle existing tables
-- Run this if some tables already exist

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text unique not null,
  telegram_chat_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS policies (drop if exist first)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Language levels
CREATE TABLE IF NOT EXISTS public.language_levels (
  id serial primary key,
  language_code text not null,
  level_code text not null,
  cefr_equivalent text,
  display_name text not null,
  description text,
  sort_order int not null,
  unique(language_code, level_code)
);

-- Insert language levels (skip if already exist)
INSERT INTO language_levels (language_code, level_code, cefr_equivalent, display_name, sort_order)
SELECT * FROM (VALUES
  ('zh-TW', 'TOCFL_1', 'A1', 'TOCFL Level 1', 1),
  ('zh-TW', 'TOCFL_2', 'A2', 'TOCFL Level 2', 2),
  ('zh-TW', 'TOCFL_3', 'B1', 'TOCFL Level 3', 3),
  ('zh-TW', 'TOCFL_4', 'B2', 'TOCFL Level 4', 4),
  ('zh-TW', 'TOCFL_5', 'C1', 'TOCFL Level 5', 5),
  ('zh-TW', 'TOCFL_6', 'C2', 'TOCFL Level 6', 6),
  ('zh-CN', 'HSK_1', 'A1', 'HSK 1', 1),
  ('zh-CN', 'HSK_2', 'A2', 'HSK 2', 2),
  ('zh-CN', 'HSK_3', 'B1', 'HSK 3', 3),
  ('zh-CN', 'HSK_4', 'B2', 'HSK 4', 4),
  ('zh-CN', 'HSK_5', 'C1', 'HSK 5', 5),
  ('zh-CN', 'HSK_6', 'C2', 'HSK 6', 6),
  ('ko', 'TOPIK_1', 'A1', 'TOPIK Level 1', 1),
  ('ko', 'TOPIK_2', 'A2', 'TOPIK Level 2', 2),
  ('ko', 'TOPIK_3', 'B1', 'TOPIK Level 3', 3),
  ('ko', 'TOPIK_4', 'B2', 'TOPIK Level 4', 4),
  ('ko', 'TOPIK_5', 'C1', 'TOPIK Level 5', 5),
  ('ko', 'TOPIK_6', 'C2', 'TOPIK Level 6', 6),
  ('ja', 'JLPT_N5', 'A1', 'JLPT N5', 1),
  ('ja', 'JLPT_N4', 'A2', 'JLPT N4', 2),
  ('ja', 'JLPT_N3', 'B1', 'JLPT N3', 3),
  ('ja', 'JLPT_N2', 'B2', 'JLPT N2', 4),
  ('ja', 'JLPT_N1', 'C1', 'JLPT N1', 5),
  ('vi', 'NLTV_1', 'A1', 'NLTV Level 1', 1),
  ('vi', 'NLTV_2', 'A2', 'NLTV Level 2', 2),
  ('vi', 'NLTV_3', 'B1', 'NLTV Level 3', 3),
  ('vi', 'NLTV_4', 'B2', 'NLTV Level 4', 4),
  ('vi', 'NLTV_5', 'C1', 'NLTV Level 5', 5),
  ('vi', 'NLTV_6', 'C2', 'NLTV Level 6', 6),
  ('th', 'CU_TFL_1', 'A1', 'CU-TFL Level 1', 1),
  ('th', 'CU_TFL_2', 'A2', 'CU-TFL Level 2', 2),
  ('th', 'CU_TFL_3', 'B1', 'CU-TFL Level 3', 3),
  ('th', 'CU_TFL_4', 'B2', 'CU-TFL Level 4', 4),
  ('th', 'CU_TFL_5', 'C1', 'CU-TFL Level 5', 5),
  ('th', 'CU_TFL_6', 'C2', 'CU-TFL Level 6', 6),
  ('de', 'A1', 'A1', 'A1', 1),
  ('de', 'A2', 'A2', 'A2', 2),
  ('de', 'B1', 'B1', 'B1', 3),
  ('de', 'B2', 'B2', 'B2', 4),
  ('de', 'C1', 'C1', 'C1', 5),
  ('de', 'C2', 'C2', 'C2', 6)
) AS v(language_code, level_code, cefr_equivalent, display_name, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM language_levels
  WHERE language_levels.language_code = v.language_code
  AND language_levels.level_code = v.level_code
);

DROP POLICY IF EXISTS "Public read access" ON public.language_levels;
CREATE POLICY "Public read access"
  ON public.language_levels FOR SELECT
  USING (true);

ALTER TABLE public.language_levels ENABLE ROW LEVEL SECURITY;

-- 3. User language profiles
CREATE TABLE IF NOT EXISTS public.user_language_profiles (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  language_code text not null,
  current_level_id int references public.language_levels(id) not null,
  is_active boolean default true,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_activity_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, language_code)
);

DROP POLICY IF EXISTS "Users can manage own language profiles" ON public.user_language_profiles;
CREATE POLICY "Users can manage own language profiles"
  ON public.user_language_profiles FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE public.user_language_profiles ENABLE ROW LEVEL SECURITY;

-- 4. Curriculum words
CREATE TABLE IF NOT EXISTS public.curriculum_words (
  id serial primary key,
  language_code text not null,
  level_id int references public.language_levels(id) not null,
  word text not null,
  pinyin_romaji text,
  definition text not null,
  example_sentence text,
  part_of_speech text,
  difficulty_score numeric(3,1),
  unique(language_code, level_id, word)
);

DROP POLICY IF EXISTS "Public read access" ON public.curriculum_words;
CREATE POLICY "Public read access"
  ON public.curriculum_words FOR SELECT
  USING (true);

ALTER TABLE public.curriculum_words ENABLE ROW LEVEL SECURITY;

-- 5. Saved words
CREATE TABLE IF NOT EXISTS public.saved_words (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  word_id int references public.curriculum_words(id) not null,
  context_snippet text,
  saved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, word_id)
);

DROP POLICY IF EXISTS "Users can manage own saved words" ON public.saved_words;
CREATE POLICY "Users can manage own saved words"
  ON public.saved_words FOR ALL
  USING (auth.uid() = user_id);

ALTER TABLE public.saved_words ENABLE ROW LEVEL SECURITY;

-- 6. Daily words
CREATE TABLE IF NOT EXISTS public.daily_words (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  language_code text not null,
  word_id int references public.curriculum_words(id) not null,
  scheduled_for timestamp with time zone not null,
  notified_at timestamp with time zone,
  interacted boolean default false,
  unique(user_id, word_id, scheduled_for)
);

DROP POLICY IF EXISTS "Users can view own daily words" ON public.daily_words;
CREATE POLICY "Users can view own daily words"
  ON public.daily_words FOR SELECT
  USING (auth.uid() = user_id);

ALTER TABLE public.daily_words ENABLE ROW LEVEL SECURITY;

-- 7. Indexes
CREATE INDEX IF NOT EXISTS idx_user_language_profiles_user_id ON public.user_language_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_words_lang_level ON public.curriculum_words(language_code, level_id);
CREATE INDEX IF NOT EXISTS idx_saved_words_user_id ON public.saved_words(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_words_scheduled ON public.daily_words(scheduled_for) WHERE notified_at is null;
CREATE INDEX IF NOT EXISTS idx_daily_words_user_id ON public.daily_words(user_id);

-- 8. Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
