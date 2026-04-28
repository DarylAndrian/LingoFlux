const axios = require('axios');

const PROJECT_REF = 'cgpmvpjwgormgkvrzsoc';
const TOKEN = 'sbp_14eb2e6f6539a00f22fb30e61fc335678bf62a8c';

async function restart() {
  console.log('Restarting database via Management API...');
  
  try {
    const res = await axios.post(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/restart`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Restart initiated:', res.data);
    console.log('Wait 2-3 minutes for restart to complete...');
  } catch (err) {
    console.error('❌ Restart failed:', err.response?.data || err.message);
  }
}

restart();
