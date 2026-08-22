import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF2193b0),
      brightness: Brightness.light,
    ),
    visualDensity: VisualDensity.adaptivePlatformDensity,
    fontFamily: 'Roboto',
    appBarTheme: const AppBarTheme(
      elevation: 0,
      centerTitle: true,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.fromSeed(
      seedColor: const Color(0xFF2193b0),
      brightness: Brightness.dark,
    ),
    visualDensity: VisualDensity.adaptivePlatformDensity,
    fontFamily: 'Roboto',
    appBarTheme: const AppBarTheme(
      elevation: 0,
      centerTitle: true,
    ),
  );
}
