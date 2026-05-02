const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const supabase = require('../utils/supabaseClient');

// TELEGRAM_BOT_TOKEN from .env
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// Helper: Send message to Telegram
async function sendMessage(chatId, text, options = {}) {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: 'Markdown',
      ...options
    });
    return response.data;
  } catch (err) {
    console.error('Telegram send error:', err.response?.data || err.message);
    throw err;
  }
}

// Webhook endpoint (for production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const update = JSON.parse(req.body.toString());
    await handleUpdate(update);
    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err);
    res.sendStatus(500);
  }
});

// Start command - link Telegram chat to user
router.post('/start', async (req, res) => {
  const { chat_id, user_email } = req.body;

  if (!chat_id || !user_email) {
    return res.status(400).json({ error: 'chat_id and user_email required' });
  }

  try {
    // Find user by email in Supabase auth (need service role)
    const { data: users, error: userError } = await supabase.auth.admin.listUsers();

    if (userError) throw userError;

    const user = users.users.find(u => u.email === user_email);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Link chat_id to user profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ telegram_chat_id: chat_id })
      .eq('id', user.id);

    if (updateError) throw updateError;

    await sendMessage(chat_id, '✅ Telegram linked successfully! You\'ll receive daily vocabulary words at your preferred time.');

    res.json({ success: true, chat_id, user_id: user.id });
  } catch (err) {
    console.error('Link error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Show today's words
router.post('/daily', async (req, res) => {
  const { chat_id } = req.body;

  try {
    // Find user by chat_id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('telegram_chat_id', chat_id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'User not found. Please /start first.' });
    }

    const today = new Date().toISOString().split('T')[0];

    // Get today's words
    const { data: dailyWords, error: wordsError } = await supabase
      .from('daily_words')
      .select(`
        *,
        curriculum_words (*)
      `)
      .eq('user_id', profile.id)
      .gte('scheduled_for', `${today}T00:00:00Z`)
      .lt('scheduled_for', `${today}T23:59:59Z`)
      .order('scheduled_for', { ascending: true });

    if (wordsError) throw wordsError;

    if (!dailyWords || dailyWords.length === 0) {
      await sendMessage(chat_id, '📚 No words scheduled for today. Check back later!');
      return res.json({ success: true, words: [] });
    }

    // Format and send words
    let message = `📚 *Today's Words*\\n\\n`;
    dailyWords.forEach((dw, index) => {
      const word = dw.curriculum_words;
      message += `${index + 1}. **${word.word}**\\n   ${word.translation}\\n   ${word.example}\\n\\n`;
    });

    await sendMessage(chat_id, message);

    res.json({ success: true, words: dailyWords });
  } catch (err) {
    console.error('Daily words error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Show saved words
router.post('/saved', async (req, res) => {
  const { chat_id, language } = req.body;

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('telegram_chat_id', chat_id)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'User not found' });
    }

    let query = supabase
      .from('saved_words')
      .select(`
        *,
        curriculum_words!inner (*)
      `)
      .eq('user_id', profile.id)
      .order('saved_at', { ascending: false })
      .limit(20);

    if (language) {
      query = query.eq('curriculum_words.language_code', language);
    }

    const { data: saved, error: savedError } = await query;

    if (savedError) throw savedError;

    if (!saved || saved.length === 0) {
      await sendMessage(chat_id, '💾 No saved words yet. Use the app to save words you want to remember!');
      return res.json({ success: true, words: [] });
    }

    let message = `💾 *Saved Words*\\n\\n`;
    saved.forEach((sw, index) => {
      const word = sw.curriculum_words;
      message += `${index + 1}. **${word.word}** (${word.language_code})\\n   ${word.translation}\\n`;
      if (sw.context_snippet) {
        message += `   📝 "${sw.context_snippet}"\\n`;
      }
      message += `\\n`;
    });

    await sendMessage(chat_id, message);

    res.json({ success: true, words: saved });
  } catch (err) {
    console.error('Saved words error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Handle Telegram inline commands (called by polling/webhook)
async function handleUpdate(update) {
  if (!update.message || !update.message.text) return;

  const chatId = update.message.chat.id;
  const text = update.message.text;

  // Parse commands
  if (text.startsWith('/')) {
    const [command, ...args] = text.split(' ');

    switch (command) {
      case '/start':
        await handleStart(chatId, args[0]); // args[0] could be auth token or email
        break;
      case '/daily':
        await handleDaily(chatId);
        break;
      case '/saved':
        await handleSaved(chatId, args[0]);
        break;
      default:
        await sendMessage(chatId, '🤖 Available commands:\n\n/start - Link your account\n/daily - Show today\'s words\n/saved - Show saved words');
    }
  }
}

async function handleStart(chatId, email) {
  if (!email) {
    await sendMessage(chatId, '👋 Welcome to LingoFlux!\n\nTo link your account, use the app or run:\n`/start your@email.com`');
    return;
  }

  try {
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users.users.find(u => u.email === email);

    if (!user) {
      await sendMessage(chatId, '❌ User not found. Please check your email or sign up first.');
      return;
    }

    await supabase
      .from('profiles')
      .update({ telegram_chat_id: chatId })
      .eq('id', user.id);

    await sendMessage(chatId, '✅ Telegram linked! You\'ll receive daily vocabulary words.');
  } catch (err) {
    console.error('Start error:', err);
    await sendMessage(chatId, '❌ Failed to link. Please try again later.');
  }
}

async function handleDaily(chatId) {
  // Reuse the logic from /daily endpoint
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: '📚 Fetching today\'s words...'
    });

    // Call the daily endpoint internally
    await axios.post(`${process.env.API_URL || 'http://localhost:3000'}/api/v1/telegram/daily`, {
      chat_id: chatId
    });
  } catch (err) {
    console.error('Daily command error:', err);
    await sendMessage(chatId, '❌ Failed to fetch words. Please try again.');
  }
}

async function handleSaved(chatId, language) {
  // Similar logic as /saved endpoint
  try {
    await axios.post(`${process.env.API_URL || 'http://localhost:3000'}/api/v1/telegram/saved`, {
      chat_id: chatId,
      language
    });
  } catch (err) {
    console.error('Saved command error:', err);
    await sendMessage(chatId, '❌ Failed to fetch saved words.');
  }
}

module.exports = { router, handleUpdate, sendMessage };
