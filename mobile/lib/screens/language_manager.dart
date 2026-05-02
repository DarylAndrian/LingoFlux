import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class LanguageManagerScreen extends StatefulWidget {
  const LanguageManagerScreen({super.key});

  @override
  State<LanguageManagerScreen> createState() => _LanguageManagerScreenState();
}

class _LanguageManagerScreenState extends State<LanguageManagerScreen> {
  final supabase = Supabase.instance.client;
  
  List<dynamic> availableLevels = [];
  List<dynamic> userLanguages = [];
  Map<String, dynamic> selectedLanguage = {};
  Map<String, dynamic> selectedLevel = {};
  bool isLoading = true;

  final Map<String, String> languageNames = {
    'zh-TW': '🇹🇼 Taiwan Mandarin',
    'zh-CN': '🇨🇳 China Mandarin (HSK)',
    'ko': '🇰🇷 Korean (TOPIK)',
    'ja': '🇯🇵 Japanese (JLPT)',
    'vi': '🇻🇳 Vietnamese (NLTV)',
    'th': '🇹🇭 Thai (CU-TFL)',
    'de': '🇩🇪 German (CEFR)',
  };

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final userId = supabase.auth.currentUser?.id;
      if (userId == null) return;

      // Fetch all language levels
      final levelsResponse = await supabase
          .from('language_levels')
          .select('*')
          .order('language_code', { ascending: true })
          .order('sort_order', { ascending: true });

      // Fetch user's active languages
      final userResponse = await supabase
          .from('user_language_profiles')
          .select('*, language_levels(*)')
          .eq('user_id', userId)
          .eq('is_active', true);

      setState(() {
        availableLevels = levelsResponse.data ?? [];
        userLanguages = userResponse.data ?? [];
        isLoading = false;
      });
    } catch (e) {
      print('Error loading data: $e');
      setState(() => isLoading = false);
    }
  }

  Future<void> _addLanguage() async {
    if (selectedLanguage.isEmpty || selectedLevel.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a language and level')),
      );
      return;
    }

    try {
      final userId = supabase.auth.currentUser?.id;
      if (userId == null) return;

      final response = await supabase.from('user_language_profiles').insert({
        'user_id': userId,
        'language_code': selectedLanguage['language_code'],
        'current_level_id': selectedLevel['id'],
        'is_active': true,
      }).select();

      if (response.error != null) throw response.error;

      await _loadData();
      
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Language added successfully!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error adding language: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Language Manager'),
        bottom: TabBar(
          tabs: [
            Tab(text: 'Active'),
            Tab(text: 'Add New'),
          ],
        ),
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              children: [
                _buildActiveLanguages(),
                _buildAddLanguage(),
              ],
            ),
    );
  }

  Widget _buildActiveLanguages() {
    if (userLanguages.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.language, size: 64, color: Colors.grey.shade300),
            const SizedBox(height: 16),
            const Text('No languages added yet'),
            const Text('Tap "Add New" to get started', style: TextStyle(color: Colors.grey)),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: userLanguages.length,
      itemBuilder: (context, index) {
        final lang = userLanguages[index];
        final level = lang['language_levels'];
        
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              child: Text(
                languageNames[lang['language_code']]?.split(' ')[1] ?? '?',
                style: const TextStyle(fontSize: 20),
              ),
            ),
            title: Text(languageNames[lang['language_code']] ?? lang['language_code']),
            subtitle: Text('Current: ${level?['display_name'] ?? 'Unknown'}'),
            trailing: Text(
              '${(lang['started_at'] != null ? _calculateDaysSince(lang['started_at']).toString() : '0')} days',
              style: const TextStyle(color: Colors.grey),
            ),
          ),
        );
      },
    );
  }

  Widget _buildAddLanguage() {
    // Group levels by language
    final groupedLevels = <String, List<dynamic>>{};
    for (final level in availableLevels) {
      final langCode = level['language_code'];
      groupedLevels.putIfAbsent(langCode, () => []);
      groupedLevels[langCode]!.add(level);
    }

    return Column(
      children: [
        _buildLanguageSelector(groupedLevels),
        if (selectedLanguage.isNotEmpty) _buildLevelSelector(),
        if (selectedLevel.isNotEmpty)
          Padding(
            padding: const EdgeInsets.all(16),
            child: ElevatedButton(
              onPressed: _addLanguage,
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 48),
              ),
              child: const Text('Add Language'),
            ),
          ),
      ],
    );
  }

  Widget _buildLanguageSelector(Map<String, List<dynamic>> groupedLevels) {
    final activeLangCodes = userLanguages.map((l) => l['language_code'].toString()).toList();
    
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: groupedLevels.length,
      itemBuilder: (context, index) {
        final langCode = groupedLevels.keys.elementAt(index);
        final isActive = activeLangCodes.contains(langCode);
        
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          child: ListTile(
            leading: Text(
              languageNames[langCode]?.split(' ')[1] ?? '?',
              style: const TextStyle(fontSize: 24),
            ),
            title: Text(languageNames[langCode] ?? langCode),
            trailing: isActive
                ? const Chip(label: Text('Active'))
                : Radio<String>(
                    value: langCode,
                    groupValue: selectedLanguage['language_code']?.toString(),
                    onChanged: (value) {
                      setState(() {
                        selectedLanguage = {'language_code': value};
                        selectedLevel = {};
                      });
                    },
                  ),
          ),
        );
      },
    );
  }

  Widget _buildLevelSelector() {
    final levels = availableLevels
        .where((l) => l['language_code'] == selectedLanguage['language_code'])
        .toList();
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.all(16),
          child: Text('Select Level', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        ),
        ...levels.map((level) {
          return RadioListTile<dynamic>(
            title: Text(level['display_name']),
            subtitle: Text('CEFR: ${level['cefr_equivalent'] ?? 'N/A'}'),
            value: level,
            groupValue: selectedLevel['id'],
            onChanged: (value) {
              setState(() {
                selectedLevel = value as Map<String, dynamic>;
              });
            },
          );
        }),
      ],
    );
  }

  int _calculateDaysSince(String dateStr) {
    final date = DateTime.parse(dateStr);
    final now = DateTime.now();
    return now.difference(date).inDays;
  }
}
