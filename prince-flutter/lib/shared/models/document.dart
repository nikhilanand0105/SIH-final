/// Document model - mirrors DocumentRecord from types.ts
class Document {
  final String id;
  final String? name;
  final String? fileName;
  final int? pages;
  final String? mimeType;
  final int? fileSize;
  final String status; // UPLOADING, QUEUED, PROCESSING, COMPLETED, FAILED
  final String? uploadedAt;
  final String? processedAt;
  final String? uploadedBy;
  final Map<String, dynamic>? metadata;
  final double? confidenceScore;

  Document({
    required this.id,
    this.name,
    this.fileName,
    this.pages,
    this.mimeType,
    this.fileSize,
    required this.status,
    this.uploadedAt,
    this.processedAt,
    this.uploadedBy,
    this.metadata,
    this.confidenceScore,
  });

  factory Document.fromJson(Map<String, dynamic> json) {
    return Document(
      id: json['id'] ?? '',
      name: json['name'],
      fileName: json['fileName'],
      pages: json['pages'],
      mimeType: json['mimeType'],
      fileSize: json['fileSize'],
      status: json['status'] ?? 'QUEUED',
      uploadedAt: json['uploadedAt'],
      processedAt: json['processedAt'],
      uploadedBy: json['uploadedBy'],
      metadata: json['metadata'],
      confidenceScore: (json['confidenceScore'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'fileName': fileName,
      'pages': pages,
      'mimeType': mimeType,
      'fileSize': fileSize,
      'status': status,
      'uploadedAt': uploadedAt,
      'processedAt': processedAt,
      'uploadedBy': uploadedBy,
      'metadata': metadata,
      'confidenceScore': confidenceScore,
    };
  }

  Document copyWith({
    String? id,
    String? name,
    String? fileName,
    int? pages,
    String? mimeType,
    int? fileSize,
    String? status,
    String? uploadedAt,
    String? processedAt,
    String? uploadedBy,
    Map<String, dynamic>? metadata,
    double? confidenceScore,
  }) {
    return Document(
      id: id ?? this.id,
      name: name ?? this.name,
      fileName: fileName ?? this.fileName,
      pages: pages ?? this.pages,
      mimeType: mimeType ?? this.mimeType,
      fileSize: fileSize ?? this.fileSize,
      status: status ?? this.status,
      uploadedAt: uploadedAt ?? this.uploadedAt,
      processedAt: processedAt ?? this.processedAt,
      uploadedBy: uploadedBy ?? this.uploadedBy,
      metadata: metadata ?? this.metadata,
      confidenceScore: confidenceScore ?? this.confidenceScore,
    );
  }
}
