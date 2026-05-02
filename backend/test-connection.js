const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log("🔗 Testing Supabase connection...");
console.log(`URL: ${supabaseUrl}`);
console.log(`Key: ${supabaseKey.substring(0, 30)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Test basic connection
    console.log("\n✅ Checking connection...");
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

    if (error) {
      console.error("❌ Connection failed:", error.message);
      return;
    }

    console.log("✅ Connection successful!");

    // Check required tables
    console.log("\n📋 Checking required tables...");
    const tables = [
      'profiles',
      'language_levels',
      'user_language_profiles',
      'curriculum_words',
      'saved_words',
      'daily_words'
    ];

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: ${count} rows`);
      }
    }

    // Check language levels data
    console.log("\n🌍 Checking language levels...");
    const { data: levels, error: levelsError } = await supabase
      .from('language_levels')
      .select('language_code, level_name, sort_order')
      .order('language_code', { ascending: true })
      .order('sort_order', { ascending: true })
      .limit(14); // 2 per language

    if (levelsError) {
      console.error("❌ Failed to fetch language levels:", levelsError.message);
    } else {
      console.log(`✅ Found ${levels.length} language levels`);
      levels.forEach(l => {
        console.log(`   ${l.language_code}: ${l.level_name}`);
      });
    }

    // Check curriculum words
    console.log("\n📚 Checking curriculum words...");
    const { count: wordCount, error: wordError } = await supabase
      .from('curriculum_words')
      .select('*', { count: 'exact', head: true });

    if (wordError) {
      console.error("❌ Failed to count words:", wordError.message);
    } else {
      console.log(`✅ Total curriculum words: ${wordCount}`);

      // Count per language
      const { data: langCounts } = await supabase
        .from('curriculum_words')
        .select('language_code')
        .order('language_code', { ascending: true });

      const counts = {};
      langCounts.forEach(w => {
        counts[w.language_code] = (counts[w.language_code] || 0) + 1;
      });

      console.log("   Words per language:");
      Object.entries(counts).forEach(([lang, count]) => {
        console.log(`      ${lang}: ${count}`);
      });
    }

    console.log("\n✅ Database test completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Database test failed:", err.message);
    process.exit(1);
  }
}

testConnection();
