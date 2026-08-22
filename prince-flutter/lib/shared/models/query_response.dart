/// Query/RAG models
class Citation {
  final String chunkId;
  final String? page;
  final String snippet;
  final double? retrievalScore;

  Citation({
    required this.chunkId,
    this.page,
    required this.snippet,
    this.retrievalScore,
  });

  factory Citation.fromJson(Map<String, dynamic> json) {
    return Citation(
      chunkId: json['chunkId'] ?? '',
      page: json['page'],
      snippet: json['snippet'] ?? '',
      retrievalScore: (json['retrievalScore'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'chunkId': chunkId,
      'page': page,
      'snippet': snippet,
      'retrievalScore': retrievalScore,
    };
  }
}

class QueryResponse {
  final String query;
  final String answer;
  final List<Citation> citations;
  final double? confidence;
  final String? responseTime;

  QueryResponse({
    required this.query,
    required this.answer,
    required this.citations,
    this.confidence,
    this.responseTime,
  });

  factory QueryResponse.fromJson(Map<String, dynamic> json) {
    return QueryResponse(
      query: json['query'] ?? '',
      answer: json['answer'] ?? '',
      citations: (json['citations'] as List<dynamic>?)
          ?.map((c) => Citation.fromJson(c as Map<String, dynamic>))
          .toList() ?? [],
      confidence: (json['confidence'] as num?)?.toDouble(),
      responseTime: json['responseTime'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'query': query,
      'answer': answer,
      'citations': citations.map((c) => c.toJson()).toList(),
      'confidence': confidence,
      'responseTime': responseTime,
    };
  }
}
