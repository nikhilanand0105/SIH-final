class AppConstants {
  // Processing stages
  static const List<String> processingStages = [
    'QUEUED',
    'EXTRACTING',
    'OCR',
    'CHUNKING',
    'EMBEDDING',
    'GRAPH_BUILDING',
    'ANALYZING',
    'COMPLETED',
  ];

  // Document types
  static const List<String> documentTypes = [
    'PDF',
    'DOCX',
    'TXT',
    'IMAGE',
  ];

  // Report types
  static const List<String> reportTypes = [
    'Executive Summary',
    'Document Extraction Report',
    'Comparison Report',
    'Risk Assessment Report',
    'Full Intelligence Report',
  ];

  // Pagination
  static const int pageSize = 20;
  static const int maxRetries = 3;
  
  // Timeouts (in milliseconds)
  static const int shortTimeout = 5000;
  static const int normalTimeout = 30000;
  static const int longTimeout = 120000;
}
