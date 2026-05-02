-- RESET LingoFlux Database
-- WARNING: This deletes ALL data
-- Only run if you want to start completely fresh

-- Drop existing tables in order (respecting foreign keys)
DROP TABLE IF EXISTS public.daily_words CASCADE;
DROP TABLE IF EXISTS public.saved_words CASCADE;
DROP TABLE IF EXISTS public.curriculum_words CASCADE;
DROP TABLE IF EXISTS public.user_language_profiles CASCADE;
DROP TABLE IF EXISTS public.language_levels CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Now run the full schema again
-- Copy and paste the contents of 001_initial_schema.sql after this
