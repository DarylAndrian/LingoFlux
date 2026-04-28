const axios = require('axios');
require('dotenv').config();

const BASE_URL = process.env.SUPABASE_URL;
const API_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const headers = {
  'apikey': API_KEY,
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

async function seed() {
  console.log('🌱 Fetching levels via REST API...');
  
  const levelsRes = await axios.get(
    `${BASE_URL}/rest/v1/language_levels?select=*`,
    { headers }
  );
  
  console.log(`Found ${levelsRes.data.length} levels.`);
  
  const words = [];
  for (const level of levelsRes.data) {
    for (let i = 1; i <= 3; i++) {
      words.push({
        language_code: level.language_code,
        level_id: level.id,
        word: `Sample${i}_${level.level_code}`,
        definition: `Definition for sample word ${i}`,
        example_sentence: `Example sentence ${i}`,
        part_of_speech: 'noun',
        difficulty_score: i
      });
    }
  }
  
  console.log(`Inserting ${words.length} words...`);
  
  const insertRes = await axios.post(
    `${BASE_URL}/rest/v1/curriculum_words`,
    words,
    { 
      headers: { ...headers, 'Prefer': 'return=representation' }
    }
  );
  
  console.log(`✅ Inserted ${insertRes.data.length} words.`);
}

seed().catch(err => {
  console.error('❌ Error:', err.response?.data || err.message);
});
