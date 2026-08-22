/// Processing Job model - mirrors ProcessingJob from types.ts
class ProcessingJob {
  final String id;
  final String documentId;
  final String stage; // QUEUED, EXTRACTING, OCR, CHUNKING, EMBEDDING, GRAPH_BUILDING, ANALYZING, COMPLETED
  final double progress; // 0.0 to 1.0
  final String status; // PENDING, IN_PROGRESS, COMPLETED, FAILED
  final String? error;
  final String? startedAt;
  final String? completedAt;
  final Map<String, dynamic>? result;

  ProcessingJob({
    required this.id,
    required this.documentId,
    required this.stage,
    required this.progress,
    required this.status,
    this.error,
    this.startedAt,
    this.completedAt,
    this.result,
  });

  factory ProcessingJob.fromJson(Map<String, dynamic> json) {
    return ProcessingJob(
      id: json['id'] ?? '',
      documentId: json['documentId'] ?? '',
      stage: json['stage'] ?? 'QUEUED',
      progress: (json['progress'] as num?)?.toDouble() ?? 0.0,
      status: json['status'] ?? 'PENDING',
      error: json['error'],
      startedAt: json['startedAt'],
      completedAt: json['completedAt'],
      result: json['result'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'documentId': documentId,
      'stage': stage,
      'progress': progress,
      'status': status,
      'error': error,
      'startedAt': startedAt,
      'completedAt': completedAt,
      'result': result,
    };
  }
}
