const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');
const auth = require('../middleware/auth');

// AI translation endpoint
router.post('/', auth, async (req, res) => {
  const { text, source_language, target_language } = req.body;

  if (!text || !target_language) {
    return res.status(400).json({ error: 'text and target_language required' });
  }

  try {
    // Smart routing: simple terms use GPT-4o, grammar/complex use Claude
    const isComplex = text.split(' ').length > 10 || /[?!。？！]/.test(text);

    let translated;
    if (isComplex) {
      // Use Claude for complex translations
      translated = await translateWithClaude(text, source_language, target_language);
    } else {
      // Use GPT-4o for simple translations
      translated = await translateWithOpenAI(text, source_language, target_language);
    }

    res.json({
      original: text,
      translated,
      source_language,
      target_language,
      provider: isComplex ? 'claude' : 'openai',
    });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ error: err.message || 'Translation failed' });
  }
});

// OpenAI translation
async function translateWithOpenAI(text, source, target) {
  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Translate the following ${source || 'auto-detected'} text to ${target}:`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a professional translator. Provide accurate, context-aware translations.' },
      { role: 'user', content: `${prompt}\n\n"${text}"` }
    ],
    temperature: 0.3,
  });

  return response.choices[0].message.content.trim();
}

// Claude translation
async function translateWithClaude(text, source, target) {
  const Anthropic = require('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Translate the following ${source || 'auto-detected'} text to ${target}. Maintain the original tone and meaning:\n\n"${text}"`
      }
    ],
  });

  return response.content[0].text.trim();
}

module.exports = router;
