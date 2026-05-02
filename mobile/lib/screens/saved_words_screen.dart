import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class SavedWordsScreen extends StatefulWidget {
  const SavedWordsScreen({super.key});

  @override
  State<SavedWordsScreen> createState() => _SavedWordsScreenState();
}

class _SavedWordsScreenState extends State<SavedWordsScreen> {
  final supabase = Supabase.instance.client;
  
  List<dynamic> savedWords = [];
  List<dynamic> filteredWords = [];
  bool isLoading = true;
  String searchQuery = '';
  String? selectedLanguage;

  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadSavedWords();
  }

  Future<void> _loadSavedWords() async {
    try {
      final userId = supabase.auth.currentUser?.id;
      if (userId == null) return;

      final response = await supabase
          .from('saved_words')
          .select('*, curriculum_words(*)')
          .eq('user_id', userId)
          .order('saved_at', { ascending: false });

      setState(() {
        savedWords = response.data ?? [];
        filteredWords = savedWords;
        isLoading = false;
      });
    } catch (e) {
      print('Error loading saved words: $e');
      setState(() => isLoading = false);
    }
  }

  void _filterWords() {
    setState(() {
      filteredWords = savedWords.where((word) {
        final curriculumWord = word['curriculum_words'];
        final wordText = (curriculumWord['word'] ?? '').toLowerCase();
        final translation = (curriculumWord['translation'] ?? '').toLowerCase();
        final context = (word['context_snippet'] ?? '').toLowerCase();
        
        final matchesSearch = wordText.contains(searchQuery.toLowerCase()) ||
                            translation.contains(searchQuery.toLowerCase()) ||
                            context.contains(searchQuery.toLowerCase());
        
        final matchesLanguage = selectedLanguage == null ||
                               (curriculumWord['language_code'] == selectedLanguage);
        
        return matchesSearch && matchesLanguage;
      }).toList();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _deleteWord(int savedWordId) async {
    try {
      final response = await supabase
          .from('saved_words')
          .delete()
          .eq('id', savedWordId);

      if (response.error != null) throw response.error;

      await _loadSavedWords();
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Word removed from saved')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error removing word: $e')),
        );
      }
    }
  }

  void _showWordDetail(dynamic word) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(word['curriculum_words']['word']),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              word['curriculum_words']['translation'] ?? '',
              style: const TextStyle(fontSize: 18, color: Colors.grey),
            ),
            const SizedBox(height: 16),
            if (word['context_snippet'] != null)
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('📝 Context:', style: TextStyle(fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text(word['context_snippet']),
                      const SizedBox(height: 8),
                      Text(
                        'Saved on: ${DateTime.parse(word['saved_at']).toString().split('.')[0]}',
                        style: const TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Words'),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.all(8.0),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search words...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          _searchController.clear();
                          setState(() {
                            searchQuery = '';
                          });
                          _filterWords();
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                ),
                filled: true,
                fillColor: Colors.grey.shade100,
              ),
              onChanged: (value) {
                setState(() {
                  searchQuery = value;
                });
                _filterWords();
              },
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Language filter
          Container(
            height: 50,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView(
              scrollDirection: Axis.horizontal,
              children: [
                _buildLanguageChip(null, 'All'),
                _buildLanguageChip('zh-TW', '🇹🇼 TW'),
                _buildLanguageChip('zh-CN', '🇨🇳 CN'),
                _buildLanguageChip('ko', '🇰🇷 KR'),
                _buildLanguageChip('ja', '🇯🇵 JP'),
                _buildLanguageChip('vi', '🇻🇳 VN'),
                _buildLanguageChip('th', '🇹🇭 TH'),
                _buildLanguageChip('de', '🇩🇪 DE'),
              ],
            ),
          ),
          
          // Words list
          Expanded(
            child: isLoading
                ? const Center(child: CircularProgressIndicator())
                : filteredWords.isEmpty
                    ? _buildEmptyState()
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: filteredWords.length,
                        itemBuilder: (context, index) {
                          final word = filteredWords[index];
                          final curriculumWord = word['curriculum_words'];
                          
                          return Card(
                            margin: const EdgeInsets.only(bottom: 8),
                            child: Dismissible(
                              key: Key(word['id'].toString()),
                              direction: DismissDirection.endToStart,
                              onDismissed: (direction) {
                                _deleteWord(word['id']);
                              },
                              background: Container(
                                color: Colors.red,
                                alignment: Alignment.centerRight,
                                padding: const EdgeInsets.only(right: 20),
                                child: const Icon(Icons.delete, color: Colors.white),
                              ),
                              child: ListTile(
                                leading: CircleAvatar(
                                  backgroundColor: Colors.purple.shade100,
                                  child: Text(
                                    curriculumWord['word']?[0].toString().toUpperCase() ?? '?',
                                    style: TextStyle(color: Colors.purple.shade700),
                                  ),
                                ),
                                title: Text(curriculumWord['word'] ?? 'Unknown'),
                                subtitle: Text(curriculumWord['translation'] ?? ''),
                                trailing: const Icon(Icons.chevron_right),
                                onTap: () => _showWordDetail(word),
                              ),
                            ),
                          );
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildLanguageChip(String? language, String label) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: selectedLanguage == language,
        onSelected: (selected) {
          setState(() {
            selectedLanguage = selected ? language : null;
          });
          _filterWords();
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    if (searchQuery.isNotEmpty || selectedLanguage != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.search, size: 64, color: Colors.grey.shade300),
            const SizedBox(height: 16),
            const Text('No words found matching your criteria'),
            const SizedBox(height: 8),
            TextButton(
              onPressed: () {
                setState(() {
                  searchQuery = '';
                  selectedLanguage = null;
                  _searchController.clear();
                });
                _filterWords();
              },
              child: const Text('Clear filters'),
            ),
          ],
        ),
      );
    }

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.bookmark_border, size: 64, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text('No saved words yet'),
          const Text('Start saving words from your daily lessons!', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}
