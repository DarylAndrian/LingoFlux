const cron = require('node-cron');
const supabase = require('./supabaseClient');

// Daily word generation (runs every hour, checks if new words needed)
const generateDailyWords = async () => {
  console.log('🔄 Running daily word generation cron...');
  
  try {
    // Get all active user language profiles
    const { data: profiles, error: profileError } = await supabase
      .from('user_language_profiles')
      .select('user_id, language_code, current_level_id');
    
    if (profileError) throw profileError;

    for (const profile of profiles) {
      // Check how many words already scheduled for today
      const today = new Date().toISOString().split('T')[0];
      const { count, error: countError } = await supabase
        .from('daily_words')
        .select('*', { count: 'exact' })
        .eq('user_id', profile.user_id)
        .eq('language_code', profile.language_code)
        .gte('scheduled_for', `${today}T00:00:00Z`)
        .lt('scheduled_for', `${today}T23:59:59Z`);

      if (countError) throw countError;

      if (count >= 10) continue; // Already have 10 words for today

      // Get words for this user's level
      const { data: words, error: wordError } = await supabase
        .from('curriculum_words')
        .select('id')
        .eq('language_code', profile.language_code)
        .eq('level_id', profile.current_level_id)
        .limit(50); // Get a pool to randomize from

      if (wordError) throw wordError;
      if (words.length === 0) continue;

      // Generate remaining words
      const wordsNeeded = 10 - count;
      for (let i = 0; i < wordsNeeded; i++) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        const randomHour = Math.floor(Math.random() * 24);
        const randomMinute = Math.floor(Math.random() * 60);
        const scheduledFor = new Date();
        scheduledFor.setHours(randomHour, randomMinute, 0, 0);

        await supabase
          .from('daily_words')
          .insert([
            {
              user_id: profile.user_id,
              language_code: profile.language_code,
              word_id: randomWord.id,
              scheduled_for: scheduledFor.toISOString(),
            }
          ]);
      }
    }

    console.log('✅ Daily word generation complete.');
  } catch (err) {
    console.error('❌ Error in daily word generation:', err.message);
  }
};

// Notification dispatcher (runs every 5 minutes)
const dispatchNotifications = async () => {
  console.log('📬 Checking for pending notifications...');
  
  try {
    const now = new Date().toISOString();
    const { data: pendingWords, error } = await supabase
      .from('daily_words')
      .select(`
        *,
        profiles (telegram_chat_id),
        curriculum_words (*)
      `)
      .lte('scheduled_for', now)
      .is('notified_at', null)
      .limit(100);

    if (error) throw error;

    for (const item of pendingWords) {
      // Send Telegram notification if chat_id exists
      if (item.profiles?.telegram_chat_id) {
        console.log(`Sending Telegram notification to ${item.profiles.telegram_chat_id}`);
        // Telegram bot sendMessage logic here
      }

      // Mark as notified
      await supabase
        .from('daily_words')
        .update({ notified_at: now })
        .eq('id', item.id);
    }

    console.log(`✅ Processed ${pendingWords.length} notifications.`);
  } catch (err) {
    console.error('❌ Error in notification dispatcher:', err.message);
  }
};

const startCronJobs = () => {
  // Run daily word generation every hour
  cron.schedule('0 * * * *', generateDailyWords);
  
  // Run notification dispatcher every 5 minutes
  cron.schedule('*/5 * * * *', dispatchNotifications);

  console.log('⏰ Cron jobs started');
};

module.exports = { startCronJobs };
