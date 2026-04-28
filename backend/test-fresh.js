const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  console.log('Testing with fresh client...');
  
  const { data, error } = await supabase
    .from('language_levels')
    .select('*');
  
  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log(`✅ Success! Found ${data.length} levels.`);
    console.log('First level:', data[0]?.display_name);
  }
}

test();
