/// Document Repository for document operations
import '../models/document.dart';
import '../../core/errors/exceptions.dart';

class DocumentRepository {
  // Mock documents for demo
  static final _mockDocuments = [
    Document(
      id: 'doc-1',
      name: 'Northstar Workspace',
      fileName: 'contract.pdf',
      pages: 14,
      mimeType: 'application/pdf',
      fileSize: 2048576,
      status: 'COMPLETED',
      uploadedAt: DateTime.now().subtract(const Duration(days: 7)).toIso8601String(),
      processedAt: DateTime.now().subtract(const Duration(days: 6)).toIso8601String(),
      uploadedBy: 'demo@documind.ai',
      confidenceScore: 0.98,
    ),
    Document(
      id: 'doc-2',
      name: 'Invoice Q3',
      fileName: 'invoice.pdf',
      pages: 2,
      mimeType: 'application/pdf',
      fileSize: 1024000,
      status: 'COMPLETED',
      uploadedAt: DateTime.now().subtract(const Duration(days: 5)).toIso8601String(),
      processedAt: DateTime.now().subtract(const Duration(days: 5)).toIso8601String(),
      uploadedBy: 'demo@documind.ai',
      confidenceScore: 0.95,
    ),
  ];

  Future<List<Document>> getDocuments() async {
    try {
      // TODO: Replace with real API call
      await Future.delayed(const Duration(milliseconds: 500));
      return _mockDocuments;
    } catch (e) {
      throw ProcessingException('Failed to fetch documents: $e');
    }
  }

  Future<Document?> getDocument(String id) async {
    try {
      // TODO: Replace with real API call
      await Future.delayed(const Duration(milliseconds: 300));
      return _mockDocuments.firstWhere((doc) => doc.id == id);
    } catch (e) {
      throw NotFoundException('Document not found: $e');
    }
  }

  Future<void> deleteDocument(String id) async {
    try {
      // TODO: Replace with real API call
      _mockDocuments.removeWhere((doc) => doc.id == id);
    } catch (e) {
      throw ProcessingException('Failed to delete document: $e');
    }
  }

  Future<Document> reprocessDocument(String id) async {
    try {
      // TODO: Replace with real API call
      final doc = await getDocument(id);
      if (doc == null) throw NotFoundException('Document not found');
      return doc.copyWith(status: 'PROCESSING');
    } catch (e) {
      throw ProcessingException('Failed to reprocess document: $e');
    }
  }
}
