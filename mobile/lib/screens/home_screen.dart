import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final supabase = Supabase.instance.client;
  
  List<dynamic> todayWords = [];
  List<dynamic> userLanguages = [];
  bool isLoading = true;
  int streakDays = 0;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final userId = supabase.auth.currentUser?.id;
      if (userId == null) return;

      // Fetch user's active languages
      final languagesResponse = await supabase
          .from('user_language_profiles')
          .select('*, language_levels(*)')
          .eq('user_id', userId)
          .eq('is_active', true);

      // Fetch today's words
      final today = DateTime.now().toIso8601String().split('T')[0];
      final wordsResponse = await supabase
          .from('daily_words')
          .select('*, curriculum_words(*)')
          .eq('user_id', userId)
          .gte('scheduled_for', '$today"' + 'T00:00:00Z' + '"')
          .lt('scheduled_for', '$today"' + 'T23:59:59Z' + '"');

      setState(() {
        userLanguages = languagesResponse.data ?? [];
        todayWords = wordsResponse.data ?? [];
        streakDays = 0; // TODO: Calculate real streak
        isLoading = false;
      });
    } catch (e) {
      print('Error loading data: $e');
      setState(() => isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('LingoFlux'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {},
          ),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  // Streak counter
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Colors.orange.shade100,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              '🔥 $streakDays days',
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                              ),
                            ),
                          ),
                          const SizedBox(width: 16),
                          const Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Keep going!', style: TextStyle(fontSize: 12, color: Colors.grey)),
                                SizedBox(height: 4),
                                Text('Daily Goal Progress: ${todayWords.length}/10', style: TextStyle(fontWeight: FontWeight.w600)),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Today's words section
                  const Text(
                    'Today\'s Words',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  
                  todayWords.isEmpty
                      ? Card(
                          child: Padding(
                            padding: const EdgeInsets.all(24),
                            child: Column(
                              children: [
                                Icon(Icons.hourglass_empty, size: 48, color: Colors.grey.shade300),
                                const SizedBox(height: 16),
                                const Text('No words for today yet', style: TextStyle(fontSize: 16)),
                                const Text('Check back later!', style: TextStyle(color: Colors.grey)),
                              ],
                            ),
                          ),
                        )
                      : ListView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: todayWords.length,
                          itemBuilder: (context, index) {
                            final word = todayWords[index]['curriculum_words'];
                            final hasInteracted = todayWords[index]['interacted'] ?? false;
                            
                            return Card(
                              margin: const EdgeInsets.only(bottom: 8),
                              child: ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: hasInteracted ? Colors.green.shade100 : Colors.blue.shade100,
                                  child: Text(
                                    word['word']?[0].toString().toUpperCase() ?? '?',
                                    style: TextStyle(
                                      color: hasInteracted ? Colors.green.shade700 : Colors.blue.shade700,
                                    ),
                                  ),
                                ),
                                title: Text(word['word'] ?? 'Unknown'),
                                subtitle: Text(word['translation'] ?? ''),
                                trailing: Icon(
                                  Icons.check_circle,
                                  color: hasInteracted ? Colors.green : Colors.grey.shade300,
                                ),
                                onTap: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) => WordDetailScreen(word: word),
                                    ),
                                  );
                                },
                              ),
                            );
                          },
                        ),
                  
                  const SizedBox(height: 24),
                  
                  // Active languages
                  const Text(
                    'Active Languages',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 16),
                  
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: userLanguages.map<Widget>((lang) {
                      final level = lang['language_levels'];
                      return Chip(
                        label: Text('${lang['language_code']}: ${level?['display_name'] ?? ''}'),
                        avatar: const CircleAvatar(child: Text('🌍')),
                      );
                    }).toList(),
                  ),
                ],
              ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const SavedWordsScreen()),
          );
        },
        child: const Icon(Icons.bookmark),
      ),
    );
  }
}

// Placeholder screens
class WordDetailScreen extends StatelessWidget {
  final dynamic word;
  
  const WordDetailScreen({super.key, required this.word});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(word['word'] ?? 'Word Detail')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              word['word'] ?? '',
              style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Text(
              word['translation'] ?? '',
              style: const TextStyle(fontSize: 20, color: Colors.grey),
            ),
            const SizedBox(height: 24),
            if (word['example_sentence'] != null)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Example:', style: TextStyle(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      Text(word['example_sentence']),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class SavedWordsScreen extends StatelessWidget {
  const SavedWordsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Saved Words')),
      body: const Center(
        child: Text('Saved words coming soon!'),
      ),
    );
  }
}
