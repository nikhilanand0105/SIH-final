# API Contract

This document defines the exact HTTP REST APIs for DocuMind, transitioning from the legacy synchronous architecture to the canonical async architecture.

## Documents

### POST /api/documents/upload
Uploads a document. This is asynchronous.
**Request:**
- `multipart/form-data`
  - `file`: The document file
**Response (202 Accepted):**
```json
{
  "document_id": "uuid",
  "job_id": "uuid",
  "status": "QUEUED"
}
```

### GET /api/documents
List all documents for the authenticated user.
**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "filename": "contract.pdf",
    "status": "COMPLETED",
    "created_at": "2026-08-22T10:00:00Z",
    "page_count": 14,
    "category": "Legal"
  }
]
```

### GET /api/documents/{id}
Get full details of a specific document, including metadata, extracted fields, and entities.
**Response (200 OK):**
```json
{
  "id": "uuid",
  "filename": "contract.pdf",
  "status": "COMPLETED",
  "summary": "...",
  "confidence": 0.95,
  "created_at": "2026-08-22T10:00:00Z"
}
```

### GET /api/documents/{id}/status
Poll processing status.
**Response (200 OK):**
```json
{
  "document_id": "uuid",
  "status": "PROCESSING",
  "job": {
    "stage": "EMBEDDING",
    "progress": 0.65,
    "message": "Generating vector embeddings..."
  }
}
```

### DELETE /api/documents/{id}
Delete a document and trigger cascading deletes in Postgres, FAISS, Object Storage, and Neo4j.
**Response (204 No Content)**

### POST /api/documents/{id}/reprocess
Re-trigger the background worker for a document (e.g., if FAILED).
**Response (202 Accepted)**

## RAG & Querying

### POST /api/query
Ask a question against a single document or the entire workspace.
**Request:**
```json
{
  "query": "What is the renewal notice period?",
  "document_id": "uuid", // Optional, if omitted, searches global workspace
  "search_type": "hybrid" // vector, keyword, or hybrid
}
```
**Response (200 OK):**
```json
{
  "answer": "The renewal notice period is 30 days.",
  "citations": [
    {
      "document_id": "uuid",
      "chunk_id": "uuid",
      "page": "p. 14",
      "snippet": "Written notice required thirty days before termination...",
      "retrieval_score": 0.92
    }
  ]
}
```
