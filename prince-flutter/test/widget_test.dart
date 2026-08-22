import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:documind_ai/main.dart';

void main() {
  testWidgets('Flutter app launches', (WidgetTester tester) async {
    await tester.pumpWidget(const DocumentMindApp());
    expect(find.byType(MaterialApp), findsWidgets);
  });
}
