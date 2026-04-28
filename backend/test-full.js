const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log('Testing all tables...\n');

  // Check language_levels
  const { data: levels, error: e1 } = await supabase
    .from('language_levels')
    .select('*');
  
  if (e1) console.log('❌ language_levels:', e1.message);
  else console.log(`✅ language_levels: ${levels.length} rows`);

  // Check curriculum_words
  const { data: words, error: e2 } = await supabase
    .from('curriculum_words')
    .select('*');
  
  if (e2) console.log('❌ curriculum_words:', e2.message);
  else console.log(`✅ curriculum_words: ${words.length} rows`);

  // Check profiles
  const { data: profiles, error: e3 } = await supabase
    .from('profiles')
    .select('*');
  
  if (e3) console.log('❌ profiles:', e3.message);
  else console.log(`✅ profiles: ${profiles.length} rows`);
}

test();
