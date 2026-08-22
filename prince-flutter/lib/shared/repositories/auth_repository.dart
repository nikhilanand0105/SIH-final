/// Auth Repository for authentication logic
import '../../core/errors/exceptions.dart';
import '../../core/storage/secure_storage.dart';
import '../models/user.dart';

class AuthRepository {
  final SecureStorage _storage;

  AuthRepository({required SecureStorage storage}) : _storage = storage;

  // Mock demo login
  Future<User> signInDemo() async {
    try {
      final demoUser = User(
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@documind.ai',
        role: 'admin',
        avatar: null,
        initials: 'DU',
        organization: 'Demo Organization',
        lastLogin: DateTime.now().toIso8601String(),
      );

      // Save to secure storage
      await _storage.setUser(demoUser);

      return demoUser;
    } catch (e) {
      throw AuthException('Failed to sign in: $e');
    }
  }

  Future<User?> getCurrentUser() async {
    try {
      return await _storage.getUser();
    } catch (e) {
      throw AuthException('Failed to get current user: $e');
    }
  }

  Future<void> logout() async {
    try {
      await _storage.clearAll();
    } catch (e) {
      throw AuthException('Failed to logout: $e');
    }
  }

  Future<bool> isLoggedIn() async {
    try {
      final user = await _storage.getUser();
      return user != null;
    } catch (e) {
      return false;
    }
  }
}
