const axios = require('axios');
require('dotenv').config();

const PROJECT_REF = 'cgpmvpjwgormgkvrzsoc';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function restart() {
  console.log('Trying Management API v1...\n');

  try {
    // Correct endpoint for Supabase Management API
    const res = await axios.post(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/restart`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Restart initiated:', res.data);
  } catch (err) {
    console.error('❌ API restart failed:', err.response?.data || err.message);
    console.log('\nPlease manually restart via Dashboard:');
    console.log('https://cgpmvpjwgormgkvrzsoc.supabase.co/project/api/settings/general');
    console.log('→ Scroll to "Database" → Click "Restart Server"');
  }
}

restart();
