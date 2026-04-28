const axios = require('axios');
require('dotenv').config();

const PROJECT_REF = 'cgpmvpjwgormgkvrzsoc'; // From your URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function restart() {
  console.log('Attempting to restart Supabase via API...');
  
  try {
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
    console.log('Please manually restart via Dashboard → Settings → Database → Restart Server');
  }
}

restart();
