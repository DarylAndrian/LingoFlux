const axios = require('axios');

const PROJECT_REF = 'cgpmvpjwgormgkvrzsoc';
const TOKEN = 'sbp_14eb2e6f6539a00f22fb30e61fc335678bf62a8c';

async function refresh() {
  console.log('Refreshing schema via SQL API...');
  
  try {
    const res = await axios.post(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      { query: 'SELECT * FROM public.language_levels LIMIT 1;' },
      {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('✅ Query successful:', res.data);
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

refresh();
