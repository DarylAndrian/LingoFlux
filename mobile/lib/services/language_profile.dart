import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class LanguageProfile extends ChangeNotifier {
  final ApiService _api = ApiService();
  
  List<dynamic> _activeLanguages = [];
  List<dynamic> _todayWords = [];
  List<dynamic> _savedWords = [];
  int _streakDays = 0;
  bool _isLoading = false;
  
  // Getters
  List<dynamic> get activeLanguages => _activeLanguages;
  List<dynamic> get todayWords => _todayWords;
  List<dynamic> get savedWords => _savedWords;
  int get streakDays => _streakDays;
  bool get isLoading => _isLoading;
  
  // Initialize
  Future<void> initialize() async {
    await _loadFromCache();
    await refreshData();
  }
  
  // Refresh all data
  Future<void> refreshData() async {
    _setLoading(true);
    try {
      await Future.wait([
        _loadActiveLanguages(),
        _loadTodayWords(),
        _loadSavedWords(),
        _calculateStreak(),
      ]);
      await _saveToCache();
    } catch (e) {
      debugPrint('Error refreshing data: $e');
    } finally {
      _setLoading(false);
    }
  }
  
  // Load active languages
  Future<void> _loadActiveLanguages() async {
    try {
      _activeLanguages = await _api.getUserLanguages();
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading languages: $e');
    }
  }
  
  // Load today's words
  Future<void> _loadTodayWords() async {
    try {
      _todayWords = await _api.getTodayWords();
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading today\'s words: $e');
      _todayWords = [];
    }
  }
  
  // Load saved words
  Future<void> _loadSavedWords({String? language}) async {
    try {
      _savedWords = await _api.getSavedWords(language: language);
      notifyListeners();
    } catch (e) {
      debugPrint('Error loading saved words: $e');
    }
  }
  
  // Add language
  Future<bool> addLanguage(String languageCode, int levelId) async {
    try {
      await _api.addUserLanguage(languageCode: languageCode, levelId: levelId);
      await refreshData();
      return true;
    } catch (e) {
      debugPrint('Error adding language: $e');
      return false;
    }
  }
  
  // Save word
  Future<bool> saveWord(int wordId, {String? contextSnippet}) async {
    try {
      await _api.saveWord(wordId: wordId, contextSnippet: contextSnippet);
      await _loadSavedWords();
      return true;
    } catch (e) {
      debugPrint('Error saving word: $e');
      return false;
    }
  }
  
  // Delete saved word
  Future<bool> deleteSavedWord(int wordId) async {
    try {
      await _api.deleteSavedWord(wordId);
      await _loadSavedWords();
      return true;
    } catch (e) {
      debugPrint('Error deleting word: $e');
      return false;
    }
  }
  
  // Filter saved words
  Future<void> filterSavedWords(String? language) async {
    await _loadSavedWords(language: language);
  }
  
  // Translate text
  Future<String?> translateText(String text, String targetLanguage, {String? sourceLanguage}) async {
    try {
      final result = await _api.translate(
        text: text,
        targetLanguage: targetLanguage,
        sourceLanguage: sourceLanguage,
      );
      return result['translated'] as String?;
    } catch (e) {
      debugPrint('Translation error: $e');
      return null;
    }
  }
  
  // Mark word as interacted
  Future<void> interactWord(int wordId) async {
    try {
      final userId = Supabase.instance.client.auth.currentUser?.id;
      if (userId != null) {
        final today = DateTime.now().toIso8601String().split('T')[0];
        await Supabase.instance.client
            .from('daily_words')
            .update({'interacted': true})
            .eq('user_id', userId)
            .eq('word_id', wordId)
            .gte('scheduled_for', '$today"T00:00:00Z"')
            .lt('scheduled_for', '$today"T23:59:59Z"');
      }
    } catch (e) {
      debugPrint('Error marking word as interacted: $e');
    }
  }
  
  // Calculate streak
  Future<void> _calculateStreak() async {
    try {
      final userId = Supabase.instance.client.auth.currentUser?.id;
      if (userId == null) {
        _streakDays = 0;
        return;
      }
      
      // Simplified streak calculation
      // In production, fetch from database
      _streakDays = await SharedPreferences.getInstance().then((prefs) {
        return prefs.getInt('streak_days') ?? 0;
      });
      
      notifyListeners();
    } catch (e) {
      _streakDays = 0;
    }
  }
  
  // Update streak (call after completing daily words)
  Future<void> updateStreak() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final current = prefs.getInt('streak_days') ?? 0;
      final lastDate = prefs.getString('last_study_date');
      final today = DateTime.now().toIso8601String().split('T')[0];
      
      if (lastDate == null) {
        // First study
        await prefs.setInt('streak_days', 1);
        await prefs.setString('last_study_date', today);
        _streakDays = 1;
      } else if (lastDate == today) {
        // Already studied today
        _streakDays = current;
      } else {
        // New day
        final lastDateTime = DateTime.parse(lastDate);
        final diff = DateTime.now().difference(lastDateTime).inDays;
        
        if (diff == 1) {
          // Streak continues
          await prefs.setInt('streak_days', current + 1);
          _streakDays = current + 1;
        } else {
          // Streak broken
          await prefs.setInt('streak_days', 1);
          _streakDays = 1;
        }
        await prefs.setString('last_study_date', today);
      }
      
      notifyListeners();
    } catch (e) {
      debugPrint('Error updating streak: $e');
    }
  }
  
  // Cache methods
  Future<void> _saveToCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final prefsData = {
        'active_languages': _activeLanguages.length,
        'today_words': _todayWords.length,
        'saved_words': _savedWords.length,
      };
      
      for (final entry in prefsData.entries) {
        await prefs.setInt(entry.key, entry.value as int);
      }
    } catch (e) {
      debugPrint('Error saving to cache: $e');
    }
  }
  
  Future<void> _loadFromCache() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      // Cache is just counts, actual data is loaded from server
      _streakDays = prefs.getInt('streak_days') ?? 0;
    } catch (e) {
      debugPrint('Error loading from cache: $e');
    }
  }
  
  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
  
  // Cleanup
  @override
  void dispose() {
    super.dispose();
  }
}
