const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const auth = require('../middleware/auth');

// Get levels for a language
router.get('/levels', async (req, res) => {
  const { language } = req.query;

  if (!language) {
    return res.status(400).json({ error: 'language query param required' });
  }

  try {
    const { data, error } = await supabase
      .from('language_levels')
      .select('*')
      .eq('language_code', language)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's active languages
router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('user_language_profiles')
      .select(`
        *,
        language_levels (*)
      `)
      .eq('user_id', req.user.sub)
      .eq('is_active', true);

    if (error) throw error;

    // Calculate streak (simplified)
    const langsWithStreak = data.map(lang => ({
      ...lang,
      streak_days: Math.floor(Math.random() * 30) // Replace with real streak logic
    }));

    res.json(langsWithStreak);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a language to user profile
router.post('/', auth, async (req, res) => {
  const { language_code, level_id } = req.body;

  if (!language_code || !level_id) {
    return res.status(400).json({ error: 'language_code and level_id required' });
  }

  try {
    const { data, error } = await supabase
      .from('user_language_profiles')
      .insert([
        {
          user_id: req.user.sub,
          language_code,
          current_level_id: level_id,
          is_active: true,
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
