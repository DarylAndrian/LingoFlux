const axios = require('axios');
require('dotenv').config();

const BASE = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Testing via direct REST API...');

// Try with explicit Accept header for schema
axios.get(`${BASE}/rest/v1/language_levels?select=*`, {
  headers: {
    'apikey': KEY,
    'Authorization': `Bearer ${KEY}`,
    'Accept': 'application/json',
    'Prefer': 'return=representation'
  }
}).then(res => {
  console.log(`✅ Success! Found ${res.data.length} levels.`);
  console.log('First:', res.data[0]?.display_name);
}).catch(err => {
  console.error('❌ Error:', err.response?.data || err.message);
});
