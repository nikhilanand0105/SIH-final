import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/config/app_config.dart';
import 'core/theme/app_theme.dart';
import 'core/storage/secure_storage.dart';
import 'shared/repositories/auth_repository.dart';
import 'screens/login_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // TODO: Initialize Hive and other services when needed
  runApp(
    const ProviderScope(
      child: DocumentMindApp(),
    ),
  );
}

class DocumentMindApp extends StatelessWidget {
  const DocumentMindApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.appName,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light,
      debugShowCheckedModeBanner: false,
      home: const LoginScreen(),
    );
  }
}
