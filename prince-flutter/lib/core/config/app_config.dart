class AppConfig {
  static const String appName = 'DocuMind AI';
  static const String appVersion = '1.0.0';
  
  // API Configuration
  static const String apiBaseUrl = 'http://192.168.137.1:8000/api/v1';
  static const int apiTimeout = 30; // seconds
  static const int apiRetries = 3;
  
  // Storage Keys
  static const String authTokenKey = 'auth_token';
  static const String userKey = 'user';
  static const String themeKey = 'app_theme';
  
  // Feature Flags
  static const bool enableAnalytics = true;
  static const bool enableCrashReporting = false;
  static const bool enableOfflineMode = true;
}
