const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const auth = require('../middleware/auth');

// Get today's words for user
router.get('/daily', auth, async (req, res) => {
  const { date } = req.query;
  const targetDate = date || new Date().toISOString().split('T')[0];

  try {
    const { data, error } = await supabase
      .from('daily_words')
      .select(`
        *,
        curriculum_words (*)
      `)
      .eq('user_id', req.user.sub)
      .gte('scheduled_for', `${targetDate}T00:00:00Z`)
      .lt('scheduled_for', `${targetDate}T23:59:59Z`);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save a word
router.post('/save', auth, async (req, res) => {
  const { word_id, context_snippet } = req.body;

  if (!word_id) {
    return res.status(400).json({ error: 'word_id required' });
  }

  try {
    const { data, error } = await supabase
      .from('saved_words')
      .insert([
        {
          user_id: req.user.sub,
          word_id,
          context_snippet,
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

// Get saved words
router.get('/saved', auth, async (req, res) => {
  const { language, limit = 20, offset = 0 } = req.query;

  try {
    let query = supabase
      .from('saved_words')
      .select(`
        *,
        curriculum_words!inner (*)
      `)
      .eq('user_id', req.user.sub)
      .order('saved_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (language) {
      query = query.eq('curriculum_words.language_code', language);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
