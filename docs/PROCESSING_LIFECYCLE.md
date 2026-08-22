# Document Processing Lifecycle

This document defines the strict, canonical processing states and transitions for the DocuMind ingestion pipeline.

## 1. Document Lifecycle (Document.status)
The document status tracks the overall availability of the document for the user.

- **UPLOADING**: The client is currently streaming the file to the server.
- **QUEUED**: The file is stored in object storage and a job has been dispatched.
- **PROCESSING**: The background worker has picked up the job and is actively analyzing the document.
- **COMPLETED**: The AI pipeline has successfully extracted text, embedded chunks, and built the graph. The document is ready for queries.
- **FAILED**: An unrecoverable error occurred during processing.

## 2. Processing Job Lifecycle (ProcessingJob.stage)
The job stage tracks the exact micro-step of the background AI worker, providing real-time feedback to the frontend via status polling.

1. **QUEUED**: Initial state. Worker has not started.
2. **EXTRACTING**: Standard text parsing via simple extractors.
3. **OCR**: (If necessary) Docling or OCR models processing complex layouts/images.
4. **CHUNKING**: Breaking text into hierarchical DocumentChunk entities.
5. **EMBEDDING**: Generating vectors and indexing them in FAISS/pgvector.
6. **GRAPH_BUILDING**: Extracting Entity and Relationship data into Neo4j.
7. **ANALYZING**: Generating the final Document.summary, Document.category, and Insight records.
8. **COMPLETED**: Terminal success state.
9. **FAILED**: Terminal error state (error_code and error_message will be populated).

## 3. State Transitions

### Happy Path
UPLOADING -> QUEUED -> EXTRACTING -> CHUNKING -> EMBEDDING -> GRAPH_BUILDING -> ANALYZING -> COMPLETED

### Failure Path
UPLOADING -> QUEUED -> EXTRACTING -> FAILED

## 4. Polling Contract
The mobile app should poll GET /api/documents/{id}/status while the Document status is PROCESSING. It will receive the ProcessingJob.stage and ProcessingJob.progress (0.0 to 1.0) to update the UI precisely.
