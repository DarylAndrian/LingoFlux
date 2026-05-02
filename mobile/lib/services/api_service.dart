import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:supabase_flutter/supabase_flutter.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:3001/api/v1';
  
  final supabase = Supabase.instance.client;
  
  // Get JWT token from Supabase
  String? get _token {
    final session = supabase.auth.currentSession;
    return session?.accessToken;
  }
  
  Map<String, String> get _headers {
    final token = _token;
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }
  
  // Auth Methods
  
  Future<Map<String, dynamic>> register({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: _headers,
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    
    return _handleResponse(response);
  }
  
  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: _headers,
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );
    
    return _handleResponse(response);
  }
  
  // Language Methods
  
  Future<List<dynamic>> getLevels({required String language}) async {
    final response = await http.get(
      Uri.parse('$baseUrl/languages/levels?language=$language'),
      headers: _headers,
    );
    
    final data = _handleResponse(response);
    return data['levels'] ?? [];
  }
  
  Future<List<dynamic>> getUserLanguages() async {
    final response = await http.get(
      Uri.parse('$baseUrl/languages'),
      headers: _headers,
    );
    
    final data = _handleResponse(response);
    return data is List ? data : [];
  }
  
  Future<Map<String, dynamic>> addUserLanguage({
    required String languageCode,
    required int levelId,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/languages'),
      headers: _headers,
      body: jsonEncode({
        'language_code': languageCode,
        'level_id': levelId,
      }),
    );
    
    return _handleResponse(response);
  }
  
  // Word Methods
  
  Future<List<dynamic>> getTodayWords({String? date}) async {
    final queryParams = date != null ? '?date=$date' : '';
    final response = await http.get(
      Uri.parse('$baseUrl/words/daily$queryParams'),
      headers: _headers,
    );
    
    final data = _handleResponse(response);
    return data is List ? data : [];
  }
  
  Future<Map<String, dynamic>> saveWord({
    required int wordId,
    String? contextSnippet,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/words/save'),
      headers: _headers,
      body: jsonEncode({
        'word_id': wordId,
        if (contextSnippet != null) 'context_snippet': contextSnippet,
      }),
    );
    
    return _handleResponse(response);
  }
  
  Future<List<dynamic>> getSavedWords({
    String? language,
    int limit = 20,
    int offset = 0,
  }) async {
    final queryParams = '?limit=$limit&offset=$offset${language != null ? '&language=$language' : ''}';
    
    final response = await http.get(
      Uri.parse('$baseUrl/words/saved$queryParams'),
      headers: _headers,
    );
    
    final data = _handleResponse(response);
    return data is List ? data : [];
  }
  
  Future<void> deleteSavedWord(int wordId) async {
    await http.delete(
      Uri.parse('$baseUrl/words/saved/$wordId'),
      headers: _headers,
    );
  }
  
  // Translation Methods
  
  Future<Map<String, dynamic>> translate({
    required String text,
    String? sourceLanguage,
    required String targetLanguage,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/translate'),
      headers: _headers,
      body: jsonEncode({
        'text': text,
        if (sourceLanguage != null) 'source_language': sourceLanguage,
        'target_language': targetLanguage,
      }),
    );
    
    return _handleResponse(response);
  }
  
  // Helper Methods
  
  Map<String, dynamic> _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return jsonDecode(response.body);
    } else {
      throw Exception('API Error: ${response.statusCode} - ${response.body}');
    }
  }
  
  // Health Check
  
  Future<bool> healthCheck() async {
    try {
      final response = await http.get(
        Uri.parse('http://localhost:3001/health'),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
