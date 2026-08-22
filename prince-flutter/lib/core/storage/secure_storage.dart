/// Secure Storage implementation using flutter_secure_storage
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'dart:convert';
import '../../shared/models/user.dart';
import '../config/app_config.dart';

class SecureStorage {
  final FlutterSecureStorage _storage;

  SecureStorage({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  Future<void> setUser(User user) async {
    final json = jsonEncode(user.toJson());
    await _storage.write(key: AppConfig.userKey, value: json);
  }

  Future<User?> getUser() async {
    final json = await _storage.read(key: AppConfig.userKey);
    if (json == null) return null;
    
    try {
      final data = jsonDecode(json) as Map<String, dynamic>;
      return User.fromJson(data);
    } catch (e) {
      return null;
    }
  }

  Future<void> setAuthToken(String token) async {
    await _storage.write(key: AppConfig.authTokenKey, value: token);
  }

  Future<String?> getAuthToken() async {
    return await _storage.read(key: AppConfig.authTokenKey);
  }

  Future<void> clearAll() async {
    await _storage.deleteAll();
  }

  Future<void> delete(String key) async {
    await _storage.delete(key: key);
  }
}
