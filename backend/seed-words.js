
const supabase = require('./src/utils/supabaseClient');

async function seedSampleWords() {
  console.log('🌱 Seeding sample curriculum words...');

  // Get level IDs first
  const { data: levels, error: levelError } = await supabase
    .from('language_levels')
    .select('id, language_code, level_code');

  if (levelError) {
    console.error('❌ Failed to fetch levels:', levelError.message);
    return;
  }

  console.log('Found ' + levels.length + ' levels.');

  // Sample words for each language/level
  const sampleWords = [];

  for (const level of levels) {
    // Add 3 sample words per level
    for (let i = 1; i <= 3; i++) {
      sampleWords.push({
        language_code: level.language_code,
        level_id: level.id,
        word: 'Sample' + i + '_' + level.level_code,
        definition: 'Definition for sample word ' + i + ' at ' + level.level_code,
        example_sentence: 'This is an example sentence for sample word ' + i + '.',
        part_of_speech: 'noun',
        difficulty_score: i
      });
    }
  }

  const { data, error } = await supabase
    .from('curriculum_words')
    .insert(sampleWords)
    .select();

  if (error) {
    console.error('❌ Seeding failed:', error.message);
  } else {
    console.log('✅ Seeded ' + data.length + ' sample words.');
  }
}

seedSampleWords();
