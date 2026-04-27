const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cgpmvpjwgormgkvrzsoc.supabase.co';
const supabaseKey = 'sb_publishable_LCOlHDduKVLLhzacgskePw_tgM7THX8';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection
async function testConnection() {
  console.log('🔄 Testing Supabase connection...');
  
  // Test 1: Check if language_levels table exists
  const { data, error } = await supabase
    .from('language_levels')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('❌ Table check failed:', error.message);
    console.log('📝 Please run the SQL migration in Supabase dashboard first.');
    console.log('📍 SQL file: backend/supabase/migrations/001_initial_schema.sql');
    return;
  }
  
  console.log('✅ Supabase connected successfully!');
  console.log('📊 language_levels count:', data?.length || 0);
}

testConnection();
