# Canonical Data Model

This document defines the definitive PostgreSQL schema models. It acts as the single source of truth for both the frontend TypeScript interfaces and the backend Pydantic models.

## User
- id (UUID, Primary Key)
- email (String)
- 
ame (String)
- created_at (DateTime)

## Document
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> User)
- ilename (String)
- mime_type (String)
- ile_size (Integer)
- storage_key (String, Path in object storage)
- status (Enum: UPLOADING, QUEUED, PROCESSING, COMPLETED, FAILED)
- page_count (Integer, Optional)
- 	itle (String, Optional)
- summary (Text, Optional)
- category (String, Optional)
- confidence (Float, Optional)
- isk (String, Optional)
- created_at (DateTime)
- updated_at (DateTime)
- completed_at (DateTime, Optional)
- error (Text, Optional)

## DocumentVersion
- id (UUID, Primary Key)
- document_id (UUID, Foreign Key -> Document)
- ersion_number (Integer)
- storage_key (String)
- created_at (DateTime)

## ProcessingJob
- id (UUID, Primary Key)
- document_id (UUID, Foreign Key -> Document)
- status (Enum: QUEUED, IN_PROGRESS, COMPLETED, FAILED)
- stage (Enum: QUEUED, EXTRACTING, OCR, CHUNKING, EMBEDDING, GRAPH_BUILDING, ANALYZING, COMPLETED, FAILED)
- progress (Float, 0.0 to 1.0)
- message (String)
- started_at (DateTime, Optional)
- completed_at (DateTime, Optional)
- error_code (String, Optional)
- error_message (Text, Optional)

## DocumentChunk
- id (UUID, Primary Key)
- document_id (UUID, Foreign Key -> Document)
- ersion_id (UUID, Foreign Key -> DocumentVersion)
- page (Integer, Optional)
- 	ext (Text)
- chunk_index (Integer)
- embedding_model (String)
- created_at (DateTime)

## Entity
- id (UUID, Primary Key)
- document_id (UUID, Foreign Key -> Document)
- 	ype (String, e.g., Person, Organization, Location, Concept)
- 
ame (String)
- canonical_name (String, Optional)
- confidence (Float)
- source_chunk_id (UUID, Foreign Key -> DocumentChunk)

## Relationship
- id (UUID, Primary Key)
- source_entity_id (UUID, Foreign Key -> Entity)
- 	arget_entity_id (UUID, Foreign Key -> Entity)
- 	ype (String)
- confidence (Float)
- source_chunk_id (UUID, Foreign Key -> DocumentChunk)

## Insight
- id (UUID, Primary Key)
- document_id (UUID, Foreign Key -> Document)
- 	itle (String)
- items (JSONB / Array of Strings)
- icon (String, Optional)
- 	one (String, Optional)
- created_at (DateTime)

## Query
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> User)
- 	ext (String)
- created_at (DateTime)

## Answer
- id (UUID, Primary Key)
- query_id (UUID, Foreign Key -> Query)
- 	ext (Text)
- created_at (DateTime)

## Citation
- id (UUID, Primary Key)
- nswer_id (UUID, Foreign Key -> Answer)
- document_id (UUID, Foreign Key -> Document)
- chunk_id (UUID, Foreign Key -> DocumentChunk)
- page (String, Optional)
- snippet (Text)
- etrieval_score (Float)

## Comparison
- id (UUID, Primary Key)
- document_a_id (UUID, Foreign Key -> Document)
- document_b_id (UUID, Foreign Key -> Document)
- summary (Text)
- changes (JSONB)
- created_at (DateTime)

## Report
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> User)
- 	itle (String)
- content (Text)
- created_at (DateTime)
