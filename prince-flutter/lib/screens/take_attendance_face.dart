import 'dart:io';

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

import '../services/api_service.dart';

class TakeAttendanceFace extends StatefulWidget {
  const TakeAttendanceFace({super.key});

  @override
  State<TakeAttendanceFace> createState() => _TakeAttendanceFaceState();
}

class _TakeAttendanceFaceState extends State<TakeAttendanceFace> {
  CameraController? _cameraController;
  List<CameraDescription> _cameras = [];
  int _selectedCameraIndex = 1;
  bool _isCameraInitialized = false;

  XFile? _capturedImage;
  bool _isUploading = false;
  Map<String, dynamic>? _uploadResult;
  String? _uploadError;

  @override
  void initState() {
    super.initState();
    _requestCameraPermission();
  }

  Future<void> _requestCameraPermission() async {
    final status = await Permission.camera.request();
    if (!mounted) return;

    if (status.isGranted) {
      _initCamera();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Camera permission denied"),
          backgroundColor: Colors.red,
        ),
      );
    }
  }

  Future<void> _initCamera() async {
    _cameras = await availableCameras();
    if (_cameras.isEmpty) return;

    if (_selectedCameraIndex >= _cameras.length) {
      _selectedCameraIndex = 0;
    }

    _cameraController = CameraController(
      _cameras[_selectedCameraIndex],
      ResolutionPreset.high,
      enableAudio: false,
    );

    await _cameraController!.initialize();
    if (!mounted) return;

    setState(() => _isCameraInitialized = true);
  }

  Future<void> _captureDocument() async {
    if (_cameraController == null || !_cameraController!.value.isInitialized) {
      return;
    }

    try {
      final picture = await _cameraController!.takePicture();
      setState(() {
        _capturedImage = picture;
        _uploadResult = null;
        _uploadError = null;
      });
    } catch (e) {
      debugPrint("Error capturing document: $e");
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Capture failed: $e")),
      );
    }
  }

  void _retake() {
    setState(() {
      _capturedImage = null;
      _uploadResult = null;
      _uploadError = null;
    });
  }

  Future<void> _usePhoto() async {
    if (_capturedImage == null || _isUploading) return;

    setState(() {
      _isUploading = true;
      _uploadError = null;
    });

    try {
      final result = await ApiService.uploadDocument(
        File(_capturedImage!.path),
        _capturedImage!.name,
      );
      if (!mounted) return;
      setState(() {
        _uploadResult = result;
        _isUploading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _uploadError = e.toString();
        _isUploading = false;
      });
    }
  }

  void _scanAnother() {
    setState(() {
      _capturedImage = null;
      _uploadResult = null;
      _uploadError = null;
    });
  }

  Future<void> _switchCamera() async {
    if (_cameras.length < 2) return;
    setState(() => _isCameraInitialized = false);
    await _cameraController?.dispose();
    _selectedCameraIndex = (_selectedCameraIndex + 1) % _cameras.length;
    await _initCamera();
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(_uploadResult != null ? "Document Captured" : "Scan Document"),
        backgroundColor: Colors.blue,
        actions: [
          if (_uploadResult == null && _capturedImage == null)
            IconButton(
              onPressed: _switchCamera,
              icon: const Icon(Icons.cameraswitch),
            ),
        ],
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_uploadResult != null) {
      return _buildSuccessView();
    }

    if (_isUploading) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircularProgressIndicator(),
            SizedBox(height: 16),
            Text("Uploading..."),
          ],
        ),
      );
    }

    if (_capturedImage != null) {
      return _buildPreviewView();
    }

    return _buildCameraView();
  }

  Widget _buildCameraView() {
    return Column(
      children: [
        const Padding(
          padding: EdgeInsets.all(16),
          child: Text(
            "Position the document inside the frame",
            style: TextStyle(fontSize: 16, color: Colors.black54),
            textAlign: TextAlign.center,
          ),
        ),
        if (_isCameraInitialized)
          Expanded(
            child: Container(
              margin: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black26,
                    blurRadius: 10,
                    spreadRadius: 2,
                    offset: Offset(0, 5),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: CameraPreview(_cameraController!),
              ),
            ),
          )
        else
          const Expanded(child: Center(child: CircularProgressIndicator())),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 20),
          child: ElevatedButton.icon(
            onPressed: _isCameraInitialized ? _captureDocument : null,
            icon: const Icon(Icons.camera_alt, color: Colors.white),
            label: const Text("Capture"),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
              minimumSize: const Size(240, 55),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(15),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPreviewView() {
    return Column(
      children: [
        Expanded(
          child: Container(
            margin: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              boxShadow: const [
                BoxShadow(
                  color: Colors.black26,
                  blurRadius: 10,
                  spreadRadius: 2,
                  offset: Offset(0, 5),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Image.file(
                File(_capturedImage!.path),
                fit: BoxFit.contain,
                width: double.infinity,
              ),
            ),
          ),
        ),
        if (_uploadError != null)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Text(
              _uploadError!,
              style: const TextStyle(color: Colors.red),
              textAlign: TextAlign.center,
            ),
          ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: _retake,
                  child: const Text("Retake"),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  onPressed: _usePhoto,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue,
                    foregroundColor: Colors.white,
                  ),
                  child: const Text("Use Photo"),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSuccessView() {
    final filename = _uploadResult?['filename']?.toString() ?? 'scan.jpg';

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 72),
            const SizedBox(height: 16),
            const Text(
              "Document Captured",
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            _infoRow("Filename", filename),
            const SizedBox(height: 8),
            _infoRow("Status", "Received successfully"),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _scanAnother,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blue,
                foregroundColor: Colors.white,
                minimumSize: const Size(200, 48),
              ),
              child: const Text("Scan Another"),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          "$label: ",
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        Flexible(child: Text(value)),
      ],
    );
  }
}
