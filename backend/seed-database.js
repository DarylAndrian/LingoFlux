const { createClient } = require("@supabase/supabase-js");
const fs = require('fs');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample seed words for each language (20 per language for demo)
const seedWords = {
  'zh-CN': [
    { word: '你好', pinyin: 'nǐ hǎo', definition: 'Hello', example: '你好，很高兴见到你。', level_id: 1 },
    { word: '谢谢', pinyin: 'xièxiè', definition: 'Thank you', example: '谢谢你的帮助。', level_id: 1 },
    { word: '爱', pinyin: 'ài', definition: 'Love', example: '我爱你。', level_id: 1 },
    { word: '朋友', pinyin: 'péngyǒu', definition: 'Friend', example: '他是我的好朋友。', level_id: 1 },
    { word: '学习', pinyin: 'xuéxí', definition: 'To study/learn', example: '我在学习中文。', level_id: 1 },
    { word: '中国', pinyin: 'Zhōngguó', definition: 'China', example: '我喜欢中国菜。', level_id: 1 },
    { word: '工作', pinyin: 'gōngzuò', definition: 'Work', example: '他在北京工作。', level_id: 1 },
    { word: '家', pinyin: 'jiā', definition: 'Home', example: '回家吧。', level_id: 1 },
    { word: '吃', pinyin: 'chī', definition: 'To eat', example: '你想吃什么？', level_id: 1 },
    { word: '看', pinyin: 'kàn', definition: 'To look/watch', example: '看书。', level_id: 1 },
    { word: '是', pinyin: 'shì', definition: 'To be', example: '我是学生。', level_id: 1 },
    { word: '不', pinyin: 'bù', definition: 'No/not', example: '对不起，我不知道。', level_id: 1 },
    { word: '会', pinyin: 'huì', definition: 'Can/will', example: '我会说中文。', level_id: 1 },
    { word: '去', pinyin: 'qù', definition: 'To go', example: '去学校。', level_id: 1 },
    { word: '来', pinyin: 'lái', definition: 'To come', example: '请来坐。', level_id: 1 },
    { word: '说', pinyin: 'shuō', definition: 'To speak', example: '说中文。', level_id: 1 },
    { word: '听', pinyin: 'tīng', definition: 'To listen', example: '听音乐。', level_id: 1 },
    { word: '写', pinyin: 'xiě', definition: 'To write', example: '写字。', level_id: 1 },
    { word: '读', pinyin: 'dú', definition: 'To read', example: '读书。', level_id: 1 },
    { word: '用', pinyin: 'yòng', definition: 'To use', example: '用电脑。', level_id: 1 },
  ],
  'zh-TW': [
    { word: '你好', pinyin: 'nǐ hǎo', definition: 'Hello', example: '你好，歡迎來台灣。', level_id: 1 },
    { word: '謝謝', pinyin: 'xièxiè', definition: 'Thank you', example: '謝謝你。', level_id: 1 },
    { word: '愛', pinyin: 'ài', definition: 'Love', example: '我愛台灣。', level_id: 1 },
    { word: '朋友', pinyin: 'péngyǒu', definition: 'Friend', example: '他是我的朋友。', level_id: 1 },
    { word: '學習', pinyin: 'xuéxí', definition: 'To learn', example: '學習繁體字。', level_id: 1 },
    { word: '台灣', pinyin: 'Táiwān', definition: 'Taiwan', example: '台灣很美。', level_id: 1 },
    { word: '工作', pinyin: 'gōngzuò', definition: 'Work', example: '在台北工作。', level_id: 1 },
    { word: '家', pinyin: 'jiā', definition: 'Home', example: '回家睡覺。', level_id: 1 },
    { word: '吃飯', pinyin: 'chīfàn', definition: 'To eat', example: '一起去吃飯吧。', level_id: 1 },
    { word: '看', pinyin: 'kàn', definition: 'To look/watch', example: '看電影。', level_id: 1 },
    { word: '是', pinyin: 'shì', definition: 'To be', example: '我是台灣人。', level_id: 1 },
    { word: '不', pinyin: 'bù', definition: 'No/not', example: '不知道。', level_id: 1 },
    { word: '會', pinyin: 'huì', definition: 'Can/will', example: '我會說台語。', level_id: 1 },
    { word: '去', pinyin: 'qù', definition: 'To go', example: '去台中。', level_id: 1 },
    { word: '來', pinyin: 'lái', definition: 'To come', example: '請來喝茶。', level_id: 1 },
    { word: '說', pinyin: 'shuō', definition: 'To speak', example: '說台語。', level_id: 1 },
    { word: '聽', pinyin: 'tīng', definition: 'To listen', example: '聽音樂。', level_id: 1 },
    { word: '寫', pinyin: 'xiě', definition: 'To write', example: '寫繁體字。', level_id: 1 },
    { word: '讀', pinyin: 'dú', definition: 'To read', example: '讀台語。', level_id: 1 },
    { word: '用', pinyin: 'yòng', definition: 'To use', example: '用繁體字。', level_id: 1 },
  ],
  'ko': [
    { word: '안녕하세요', pinyin: 'annyeonghaseyo', definition: 'Hello/Formal', example: '안녕하세요, 만나서 반갑습니다.', level_id: 1 },
    { word: '감사합니다', pinyin: 'gamsahamnida', definition: 'Thank you', example: '도와주셔서 감사합니다.', level_id: 1 },
    { word: '사랑', pinyin: 'sarang', definition: 'Love', example: '나는 당신을 사랑해요.', level_id: 1 },
    { word: '친구', pinyin: 'chingu', definition: 'Friend', example: '그는 내 친구입니다.', level_id: 1 },
    { word: '공부', pinyin: 'gongbu', definition: 'Study', example: '한국어를 공부해요.', level_id: 1 },
    { word: '한국', pinyin: 'Hanguk', definition: 'Korea', example: '한국에 왔습니다.', level_id: 1 },
    { word: '일', pinyin: 'il', definition: 'Work', example: '서울에서 일해요.', level_id: 1 },
    { word: '집', pinyin: 'jip', definition: 'Home', example: '집에 가고 싶어요.', level_id: 1 },
    { word: '먹다', pinyin: 'meokda', definition: 'To eat', example: '밥 먹었어요?', level_id: 1 },
    { word: '보다', pinyin: 'boda', definition: 'To see', example: '영화를 봐요.', level_id: 1 },
    { word: '있다', pinyin: 'itda', definition: 'To have/exist', example: '돈이 있어요.', level_id: 1 },
    { word: '없다', pinyin: 'eopda', definition: 'To not have/not exist', example: '시간이 없어요.', level_id: 1 },
    { word: '하다', pinyin: 'hada', definition: 'To do', example: '무엇을 해요?', level_id: 1 },
    { word: '가다', pinyin: 'gada', definition: 'To go', example: '학교에 가요.', level_id: 1 },
    { word: '오다', pinyin: 'oda', definition: 'To come', example: '학교에 와요.', level_id: 1 },
    { word: '말하다', pinyin: 'malhada', definition: 'To speak', example: '한국어 말해요.', level_id: 1 },
    { word: '듣다', pinyin: 'deutda', definition: 'To listen', example: '음악을 들어요.', level_id: 1 },
    { word: '쓰다', pinyin: 'sseuda', definition: 'To write', example: '한글을 써요.', level_id: 1 },
    { word: '읽다', pinyin: 'ikda', definition: 'To read', example: '책을 읽어요.', level_id: 1 },
    { word: '빌리다', pinyin: 'billida', definition: 'To borrow', example: '책을 빌려요.', level_id: 1 },
  ],
  'ja': [
    { word: 'こんにちは', pinyin: 'konnichiwa', definition: 'Hello/Good afternoon', example: 'こんにちは、はじめまして。', level_id: 1 },
    { word: 'ありがとう', pinyin: 'arigatou', definition: 'Thank you', example: 'ありがとうございます。', level_id: 1 },
    { word: '愛', pinyin: 'ai', definition: 'Love', example: 'あなたを愛しています。', level_id: 1 },
    { word: '友達', pinyin: 'tomodachi', definition: 'Friend', example: '彼は私の友達です。', level_id: 1 },
    { word: '勉強', pinyin: 'benkyou', definition: 'Study', example: '日本語を勉強しています。', level_id: 1 },
    { word: '日本', pinyin: 'Nihon', definition: 'Japan', example: '日本に行きました。', level_id: 1 },
    { word: '仕事', pinyin: 'shigoto', definition: 'Work', example: '仕事に行きます。', level_id: 1 },
    { word: '家', pinyin: 'ie', definition: 'Home', example: '家に帰ります。', level_id: 1 },
    { word: '食べる', pinyin: 'taberu', definition: 'To eat', example: 'ご飯を食べました。', level_id: 1 },
    { word: '見る', pinyin: 'miru', definition: 'To see', example: '映画を見ます。', level_id: 1 },
    { word: 'ある', pinyin: 'aru', definition: 'To exist (inanimate)', example: '部屋に机があります。', level_id: 1 },
    { word: 'いる', pinyin: 'iru', definition: 'To exist (animate)', example: '部屋に猫がいます。', level_id: 1 },
    { word: 'する', pinyin: 'suru', definition: 'To do', example: '勉強します。', level_id: 1 },
    { word: '行く', pinyin: 'iku', definition: 'To go', example: '学校に行きます。', level_id: 1 },
    { word: '来る', pinyin: 'kuru', definition: 'To come', example: '学校に来ます。', level_id: 1 },
    { word: '話す', pinyin: 'hanasu', definition: 'To speak', example: '日本語を話します。', level_id: 1 },
    { word: '聞く', pinyin: 'kiku', definition: 'To listen', example: '音楽を聞きます。', level_id: 1 },
    { word: '書く', pinyin: 'kaku', definition: 'To write', example: '手紙を書きます。', level_id: 1 },
    { word: '読む', pinyin: 'yomu', definition: 'To read', example: '本を読みます。', level_id: 1 },
    { word: '使う', pinyin: 'tsukau', definition: 'To use', example: 'パソコンを使います。', level_id: 1 },
  ],
  'vi': [
    { word: 'xin chào', pinyin: 'xin chào', definition: 'Hello', example: 'Xin chào, tôi tên là...', level_id: 1 },
    { word: 'cảm ơn', pinyin: 'cảm ơn', definition: 'Thank you', example: 'Cảm ơn bạn rất nhiều.', level_id: 1 },
    { word: 'yêu', pinyin: 'yêu', definition: 'Love', example: 'Tôi yêu gia đình tôi.', level_id: 1 },
    { word: 'bạn bè', pinyin: 'bạn bè', definition: 'Friend', example: 'Anh ấy là bạn của tôi.', level_id: 1 },
    { word: 'học', pinyin: 'học', definition: 'To learn', example: 'Tôi đang học tiếng Việt.', level_id: 1 },
    { word: 'Việt Nam', pinyin: 'Việt Nam', definition: 'Vietnam', example: 'Tôi yêu Việt Nam.', level_id: 1 },
    { word: 'công việc', pinyin: 'công việc', definition: 'Work', example: 'Anh ấy làm việc ở Hà Nội.', level_id: 1 },
    { word: 'nhà', pinyin: 'nhà', definition: 'Home', example: 'Về nhà đi.', level_id: 1 },
    { word: 'ăn', pinyin: 'ăn', definition: 'To eat', example: 'Bạn đã ăn chưa?', level_id: 1 },
    { word: 'nhìn', pinyin: 'nhìn', definition: 'To look', example: 'Nhìn phim.', level_id: 1 },
    { word: 'có', pinyin: 'có', definition: 'To have', example: 'Tôi có một chiếc xe.', level_id: 1 },
    { word: 'không', pinyin: 'không', definition: 'No/not', example: 'Tôi không biết.', level_id: 1 },
    { word: 'làm', pinyin: 'làm', definition: 'To do', example: 'Bạn làm gì?', level_id: 1 },
    { word: 'đi', pinyin: 'đi', definition: 'To go', example: 'Đi học.', level_id: 1 },
    { word: 'đến', pinyin: 'đến', definition: 'To come/arrive', example: 'Đến nhà tôi.', level_id: 1 },
    { word: 'nói', pinyin: 'nói', definition: 'To speak', example: 'Nói tiếng Việt.', level_id: 1 },
    { word: 'nghe', pinyin: 'nghe', definition: 'To listen', example: 'Nghe nhạc.', level_id: 1 },
    { word: 'viết', pinyin: 'viết', definition: 'To write', example: 'Viết chữ tiếng Việt.', level_id: 1 },
    { word: 'đọc', pinyin: 'đọc', definition: 'To read', example: 'Đọc sách.', level_id: 1 },
    { word: 'dùng', pinyin: 'dùng', definition: 'To use', example: 'Dùng máy tính.', level_id: 1 },
  ],
  'th': [
    { word: 'สวัสดี', pinyin: 'sà-wàt-dee', definition: 'Hello', example: 'สวัสดีครับ/ค่ะ', level_id: 1 },
    { word: 'ขอบคุณ', pinyin: 'khòp-khun', definition: 'Thank you', example: 'ขอบคุณมากครับ/ค่ะ', level_id: 1 },
    { word: 'รัก', pinyin: 'rák', definition: 'Love', example: 'ผม/ฉันรักครอบครัว', level_id: 1 },
    { word: 'เพื่อน', pinyin: 'phʉ̂ʉan', definition: 'Friend', example: 'เขาคือเพื่อนของฉัน', level_id: 1 },
    { word: 'เรียน', pinyin: 'rīan', definition: 'To learn', example: 'ฉันกำลังเรียนภาษาไทย', level_id: 1 },
    { word: 'ไทย', pinyin: 'thai', definition: 'Thai/Thailand', example: 'ฉันชอบอาหารไทย', level_id: 1 },
    { word: 'งาน', pinyin: 'ngaan', definition: 'Work', example: 'ทำงานที่กรุงเทพฯ', level_id: 1 },
    { word: 'บ้าน', pinyin: 'bâan', definition: 'Home', example: 'กลับบ้านเถอะ', level_id: 1 },
    { word: 'กิน', pinyin: 'gin', definition: 'To eat', example: 'คุณกินข้าวหรือยัง', level_id: 1 },
    { word: 'ดู', pinyin: 'dūu', definition: 'To look/watch', example: 'ดูหนัง', level_id: 1 },
    { word: 'มี', pinyin: 'mii', definition: 'To have', example: 'ผม/ฉันมีรถ', level_id: 1 },
    { word: 'ไม่', pinyin: 'mâi', definition: 'No/not', example: 'ผม/ฉันไม่รู้', level_id: 1 },
    { word: 'ทำ', pinyin: 'tam', definition: 'To do', example: 'ทำอะไรอยู่ครับ/ค่ะ', level_id: 1 },
    { word: 'ไป', pinyin: 'bpai', definition: 'To go', example: 'ไปเรียน', level_id: 1 },
    { word: 'มา', pinyin: 'maa', definition: 'To come', example: 'มาหาผม/ฉัน', level_id: 1 },
    { word: 'พูด', pinyin: 'phûut', definition: 'To speak', example: 'พูดภาษาไทย', level_id: 1 },
    { word: 'ฟัง', pinyin: 'fang', definition: 'To listen', example: 'ฟังเพลง', level_id: 1 },
    { word: 'เขียน', pinyin: 'khiian', definition: 'To write', example: 'เขียนภาษาไทย', level_id: 1 },
    { word: 'อ่าน', pinyin: 'àan', definition: 'To read', example: 'อ่านหนังสือ', level_id: 1 },
    { word: 'ใช้', pinyin: 'châi', definition: 'To use', example: 'ใช้คอมพิวเตอร์', level_id: 1 },
  ],
  'de': [
    { word: 'Hallo', pinyin: 'Hallo', definition: 'Hello', example: 'Hallo, wie geht es dir?', level_id: 1 },
    { word: 'Danke', pinyin: 'Danke', definition: 'Thank you', example: 'Danke für deine Hilfe.', level_id: 1 },
    { word: 'Liebe', pinyin: 'Liebe', definition: 'Love', example: 'Ich liebe dich.', level_id: 1 },
    { word: 'Freund', pinyin: 'Freund', definition: 'Friend', example: 'Er ist mein Freund.', level_id: 1 },
    { word: 'lernen', pinyin: 'lernen', definition: 'To learn', example: 'Ich lerne Deutsch.', level_id: 1 },
    { word: 'Deutschland', pinyin: 'Deutschland', definition: 'Germany', example: 'Ich mag Deutschland.', level_id: 1 },
    { word: 'Arbeit', pinyin: 'Arbeit', definition: 'Work', example: 'Ich arbeite in Berlin.', level_id: 1 },
    { word: 'Haus', pinyin: 'Haus', definition: 'Home', example: 'Ich gehe nach Hause.', level_id: 1 },
    { word: 'essen', pinyin: 'essen', definition: 'To eat', example: 'Möchtest du essen?', level_id: 1 },
    { word: 'sehen', pinyin: 'sehen', definition: 'To see/look', example: 'Ich sehe einen Film.', level_id: 1 },
    { word: 'haben', pinyin: 'haben', definition: 'To have', example: 'Ich habe ein Auto.', level_id: 1 },
    { word: 'nicht', pinyin: 'nicht', definition: 'No/not', example: 'Ich weiß nicht.', level_id: 1 },
    { word: 'machen', pinyin: 'machen', definition: 'To do', example: 'Was machst du?', level_id: 1 },
    { word: 'gehen', pinyin: 'gehen', definition: 'To go', example: 'Ich gehe zur Schule.', level_id: 1 },
    { word: 'kommen', pinyin: 'kommen', definition: 'To come', example: 'Komm zu mir.', level_id: 1 },
    { word: 'sprechen', pinyin: 'sprechen', definition: 'To speak', example: 'Ich spreche Deutsch.', level_id: 1 },
    { word: 'hören', pinyin: 'hören', definition: 'To listen', example: 'Ich höre Musik.', level_id: 1 },
    { word: 'schreiben', pinyin: 'schreiben', definition: 'To write', example: 'Ich schreibe einen Brief.', level_id: 1 },
    { word: 'lesen', pinyin: 'lesen', definition: 'To read', example: 'Ich lese ein Buch.', level_id: 1 },
    { word: 'benutzen', pinyin: 'benutzen', definition: 'To use', example: 'Ich benutze den Computer.', level_id: 1 },
  ],
};

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Get language levels to map codes to IDs
    const { data: levels, error: levelsError } = await supabase
      .from('language_levels')
      .select('*')
      .order('language_code', { ascending: true });
    
    if (levelsError) {
      console.error('❌ Failed to fetch language levels:', levelsError.message);
      console.log('\n⚠️  Database tables may not exist.');
      console.log('Please run the schema migration first:');
      console.log('https://console.supabase.com/project/cgpmvpjwgormgkvrzsoc/sql');
      process.exit(1);
    }
    
    console.log(`✅ Found ${levels.length} language levels`);
    
    // Create level ID map
    const levelMap = {};
    levels.forEach(level => {
      const key = `${level.language_code}_${level.level_code}`;
      levelMap[key] = level.id;
    });
    
    console.log('\n📚 Seeding curriculum words...');
    
    let totalInserted = 0;
    
    for (const [langCode, words] of Object.entries(seedWords)) {
      console.log(`\n   Seeding ${langCode}: ${words.length} words...`);
      
      // Get first level ID for this language
      const firstLevel = levels.find(l => l.language_code === langCode);
      if (!firstLevel) {
        console.log(`   ⚠️  No level found for ${langCode}, skipping`);
        continue;
      }
      
      const levelId = firstLevel.id;
      
      // Insert words
      const wordsToInsert = words.map(w => ({
        language_code: langCode,
        level_id: levelId,
        word: w.word,
        pinyin_romaji: w.pinyin,
        definition: w.definition,
        example_sentence: w.example,
        part_of_speech: 'noun',
        difficulty_score: 1.0,
      }));
      
      const { data, error } = await supabase
        .from('curriculum_words')
        .insert(wordsToInsert)
        .select();
      
      if (error) {
        console.error(`   ❌ Error inserting ${langCode}:`, error.message);
      } else {
        console.log(`   ✅ Inserted ${data.length} words for ${langCode}`);
        totalInserted += data.length;
      }
    }
    
    console.log(`\n✅ Seeding complete! Total words inserted: ${totalInserted}`);
    
    // Verify counts
    console.log('\n📊 Verification:');
    const { count: totalCount, error: countError } = await supabase
      .from('curriculum_words')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`   Total curriculum words in database: ${totalCount}`);
    }
    
    const { data: langs, error: langError } = await supabase
      .from('curriculum_words')
      .select('language_code')
      .order('language_code', { ascending: true });
    
    if (!langError) {
      const counts = {};
      langs.forEach(w => {
        counts[w.language_code] = (counts[w.language_code] || 0) + 1;
      });
      
      console.log('   Words per language:');
      Object.entries(counts).forEach(([lang, count]) => {
        console.log(`      ${lang}: ${count}`);
      });
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seedDatabase();
