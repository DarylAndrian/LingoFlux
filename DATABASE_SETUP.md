# DATABASE SETUP - MANUAL STEP REQUIRED

## ⚠️ Supabase API Issue

Supabase REST API is returning "Invalid API key" errors. This requires manual schema application.

## 📝 Step-by-Step Manual Setup

### 1. Go to Supabase SQL Editor

Open this URL in your browser:
```
https://console.supabase.com/project/cgpmvpjwgormgkvrzsoc/sql
```

### 2. Create SQL Query

Click "New query" in the SQL Editor

### 3. Copy Schema

Copy the entire contents of this file:
```
/root/.openclaw/shared-resources/LingoFlux/backend/apply-schema.sh
```

The schema SQL is in:
```
/root/.openclaw/shared-resources/LingoFlux/backend/supabase/migrations/
001_initial_schema.sql
```

### 4. Paste and Run

Paste the SQL into the editor and click "Run" (▶️)

### 5. Verify Success

Run this to check:
```bash
cd /root/.openclaw/shared-resources/LingoFlux/backend
node test-connection.js
```

Expected output:
```
✅ Connection successful!
📋 Checking required tables...
✅ profiles: N rows
✅ language_levels: 42 rows
✅ user_language_profiles: 0 rows
✅ curriculum_words: 0 rows
✅ saved_words: 0 rows
✅ daily_words: 0 rows
```

### 6. Seed Words

After schema is applied, run:
```bash
node seed-database.js
```

This will insert 140 sample words (20 per language):
- 🇨🇳 Chinese (HSK): 20 words
- 🇹🇼 Taiwan Mandarin (TOCFL): 20 words
- 🇰🇷 Korean (TOPIK): 20 words
- 🇯🇵 Japanese (JLPT): 20 words
- 🇻🇳 Vietnamese (NLTV): 20 words
- 🇹🇭 Thai (CU-TFL): 20 words
- 🇩🇪 German (CEFR): 20 words

## 🔍 Troubleshooting

### "Table does not exist" error
→ Schema not applied. Run Step 1-4 above.

### "Invalid API key" error
→ Ignore, use manual SQL setup (Step 1-4).

### Key expired
→ Generate new keys in Supabase Dashboard:
  https://console.supabase.com/project/cgpmvpjwgormgkvrzsoc/settings/api

## 📊 After Setup

Your database will have:
- 6 tables with RLS policies
- 42 language levels across 7 languages
- 140 sample words
- Triggers for auto profile creation

---

**Status:** Waiting for manual schema application
**Priority:** CRITICAL - Required for app to work
**Estimated time:** 5-10 minutes
