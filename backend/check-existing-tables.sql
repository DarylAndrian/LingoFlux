-- Check existing tables in LingoFlux database
-- Run this to see what's already created

SELECT
  table_name,
  table_type,
  is_insertable_into
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
