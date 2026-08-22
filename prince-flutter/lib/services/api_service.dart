import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

class ApiService {
  // Android emulator → host machine: http://10.0.2.2:8000
  // Physical device → your PC LAN IP, e.g. http://192.168.1.10:8000
  static const String docuMindBaseUrl = "http://172.20.138.193:8000";

  static Future<Map<String, dynamic>> uploadDocument(
    File file,
    String filename,
  ) async {
    final url = Uri.parse("$docuMindBaseUrl/api/v1/documents/upload");
    final request = http.MultipartRequest("POST", url);
    request.files.add(
      await http.MultipartFile.fromPath(
        "file",
        file.path,
        filename: filename.isNotEmpty ? filename : "scan.jpg",
      ),
    );

    final streamed = await request.send();
    final response = await http.Response.fromStream(streamed);

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    }

    throw Exception(
      "Upload failed (${response.statusCode}): ${response.body}",
    );
  }

  // Legacy attendance backend login (unused by document scan flow).
  static const String baseUrl = "https://sihbackend-hkqc.onrender.com";

  static Future<Map<String, dynamic>> login(
    String email,
    String password,
  ) async {
    final url = Uri.parse("$baseUrl/auth/login");

    final response = await http.post(
      url,
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: {
        "username": email,
        "password": password,
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else if (response.statusCode == 401) {
      throw Exception("Invalid email or password");
    } else {
      throw Exception(
        "Login failed: ${response.statusCode} ${response.reasonPhrase}",
      );
    }
  }
}
