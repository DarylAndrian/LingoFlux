-- LingoFlux Database Migration
-- Run this in Supabase SQL Editor

-- 1. Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text unique not null,
  telegram_chat_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Language levels lookup table
create table public.language_levels (
  id serial primary key,
  language_code text not null,
  level_code text not null,
  cefr_equivalent text,
  display_name text not null,
  description text,
  sort_order int not null,
  unique(language_code, level_code)
);

-- Seed data: 7 languages
insert into language_levels (language_code, level_code, cefr_equivalent, display_name, sort_order) values
-- TOCFL (Taiwan Mandarin)
('zh-TW', 'TOCFL_1', 'A1', 'TOCFL Level 1', 1),
('zh-TW', 'TOCFL_2', 'A2', 'TOCFL Level 2', 2),
('zh-TW', 'TOCFL_3', 'B1', 'TOCFL Level 3', 3),
('zh-TW', 'TOCFL_4', 'B2', 'TOCFL Level 4', 4),
('zh-TW', 'TOCFL_5', 'C1', 'TOCFL Level 5', 5),
('zh-TW', 'TOCFL_6', 'C2', 'TOCFL Level 6', 6),
-- HSK (China Mandarin)
('zh-CN', 'HSK_1', 'A1', 'HSK 1', 1),
('zh-CN', 'HSK_2', 'A2', 'HSK 2', 2),
('zh-CN', 'HSK_3', 'B1', 'HSK 3', 3),
('zh-CN', 'HSK_4', 'B2', 'HSK 4', 4),
('zh-CN', 'HSK_5', 'C1', 'HSK 5', 5),
('zh-CN', 'HSK_6', 'C2', 'HSK 6', 6),
-- TOPIK (Korean)
('ko', 'TOPIK_1', 'A1', 'TOPIK Level 1', 1),
('ko', 'TOPIK_2', 'A2', 'TOPIK Level 2', 2),
('ko', 'TOPIK_3', 'B1', 'TOPIK Level 3', 3),
('ko', 'TOPIK_4', 'B2', 'TOPIK Level 4', 4),
('ko', 'TOPIK_5', 'C1', 'TOPIK Level 5', 5),
('ko', 'TOPIK_6', 'C2', 'TOPIK Level 6', 6),
-- JLPT (Japanese)
('ja', 'JLPT_N5', 'A1', 'JLPT N5', 1),
('ja', 'JLPT_N4', 'A2', 'JLPT N4', 2),
('ja', 'JLPT_N3', 'B1', 'JLPT N3', 3),
('ja', 'JLPT_N2', 'B2', 'JLPT N2', 4),
('ja', 'JLPT_N1', 'C1', 'JLPT N1', 5),
-- NLTV (Vietnamese)
('vi', 'NLTV_1', 'A1', 'NLTV Level 1', 1),
('vi', 'NLTV_2', 'A2', 'NLTV Level 2', 2),
('vi', 'NLTV_3', 'B1', 'NLTV Level 3', 3),
('vi', 'NLTV_4', 'B2', 'NLTV Level 4', 4),
('vi', 'NLTV_5', 'C1', 'NLTV Level 5', 5),
('vi', 'NLTV_6', 'C2', 'NLTV Level 6', 6),
-- CU-TFL (Thai)
('th', 'CU_TFL_1', 'A1', 'CU-TFL Level 1', 1),
('th', 'CU_TFL_2', 'A2', 'CU-TFL Level 2', 2),
('th', 'CU_TFL_3', 'B1', 'CU-TFL Level 3', 3),
('th', 'CU_TFL_4', 'B2', 'CU-TFL Level 4', 4),
('th', 'CU_TFL_5', 'C1', 'CU-TFL Level 5', 5),
('th', 'CU_TFL_6', 'C2', 'CU-TFL Level 6', 6),
-- CEFR (German)
('de', 'A1', 'A1', 'A1', 1),
('de', 'A2', 'A2', 'A2', 2),
('de', 'B1', 'B1', 'B1', 3),
('de', 'B2', 'B2', 'B2', 4),
('de', 'C1', 'C1', 'C1', 5),
('de', 'C2', 'C2', 'C2', 6);

alter table public.language_levels enable row level security;
create policy "Public read access"
  on public.language_levels for select
  using (true);

-- 3. User language profiles
create table public.user_language_profiles (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  language_code text not null,
  current_level_id int references public.language_levels(id) not null,
  is_active boolean default true,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_activity_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, language_code)
);

alter table public.user_language_profiles enable row level security;
create policy "Users can manage own language profiles"
  on public.user_language_profiles for all
  using (auth.uid() = user_id);

-- 4. Curriculum words
create table public.curriculum_words (
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

alter table public.curriculum_words enable row level security;
create policy "Public read access"
  on public.curriculum_words for select
  using (true);

-- 5. Saved words
create table public.saved_words (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  word_id int references public.curriculum_words(id) not null,
  context_snippet text,
  saved_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, word_id)
);

alter table public.saved_words enable row level security;
create policy "Users can manage own saved words"
  on public.saved_words for all
  using (auth.uid() = user_id);

-- 6. Daily words
create table public.daily_words (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  language_code text not null,
  word_id int references public.curriculum_words(id) not null,
  scheduled_for timestamp with time zone not null,
  notified_at timestamp with time zone,
  interacted boolean default false,
  unique(user_id, word_id, scheduled_for)
);

alter table public.daily_words enable row level security;
create policy "Users can view own daily words"
  on public.daily_words for select
  using (auth.uid() = user_id);

-- 7. Indexes
create index idx_user_language_profiles_user_id on public.user_language_profiles(user_id);
create index idx_curriculum_words_lang_level on public.curriculum_words(language_code, level_id);
create index idx_saved_words_user_id on public.saved_words(user_id);
create index idx_daily_words_scheduled on public.daily_words(scheduled_for) where notified_at is null;
create index idx_daily_words_user_id on public.daily_words(user_id);

-- 8. Auto-create profile trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
