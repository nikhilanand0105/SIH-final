/**
 * Centralized type definitions for DocuMind AI
 * These types are used across the mobile app and should match backend Pydantic models
 */

// ========== Authentication & Users ==========
export interface DemoUser {
  id?: string;
  name: string;
  email?: string;
  role?: string;
  avatar?: string;
  initials?: string;
  organization?: string;
  lastLogin?: string;
}

// ========== Documents ==========
export interface DocumentRecord {
  id: string;
  filename: string;
  status: 'UPLOADING' | 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  created_at: string;
  page_count?: number;
  confidence?: number;
  category?: string;
  summary?: string;
  risk?: string;
}

export interface DocumentFile {
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
}

export interface DocumentInput {
  source: 'file' | 'camera';
  file?: DocumentFile;
}

export interface DocumentDetail extends DocumentRecord {
  pages?: number;
  entities?: string[];
  insights?: string[];
  relationships?: Array<{ source: string; target: string; type: string }>;
}

// ========== Processing & Jobs ==========
export interface ProcessingJob {
  id: string;
  document_id: string;
  status: 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  stage: 'QUEUED' | 'EXTRACTING' | 'OCR' | 'CHUNKING' | 'EMBEDDING' | 'GRAPH_BUILDING' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  progress: number;
  message: string;
  started_at?: string;
  completed_at?: string;
  error_code?: string;
  error_message?: string;
}

// ========== AI & RAG ==========
export interface QueryRequest {
  query: string;
  document_id?: string;
  search_type?: 'vector' | 'keyword' | 'hybrid';
}

export interface Citation {
  document_id: string;
  chunk_id: string;
  page: string;
  snippet: string;
  retrieval_score: number;
}

export interface QueryResponse {
  answer: string;
  citations: Citation[];
}

// ========== Knowledge Graph ==========
export interface Entity {
  id: string;
  name: string;
  type: string;
  confidence: number;
}

export interface Relationship {
  id: string;
  source_id: string;
  target_id: string;
  type: string;
  confidence: number;
}

export interface GraphEntity {
  id: string;
  name: string;
  kind: string;
  detail: string;
  related: string[];
}

// ========== Dashboard & Insights ==========
export interface ActivityItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  icon: string;
  tone: string;
}

export interface InsightItem {
  id: string;
  title: string;
  detail: string;
  severity: 'Low' | 'Medium' | 'High';
  source: string;
}

export interface NotificationItem {
  id: string;
  category: string;
  title: string;
  detail: string;
  time: string;
  read: boolean;
  tone: string;
}

// ========== Reports ==========
export type ReportType = 'Executive Summary' | 'Document Extraction Report' | 'Comparison Report' | 'Risk Assessment Report' | 'Full Intelligence Report';
export type ReportStatus = 'Draft' | 'Ready' | 'Archived' | 'Generating' | 'Failed';

export interface Report {
  id: string;
  title?: string;
  type: ReportType;
  status: ReportStatus;
  created_at?: string;
  content?: string;
}

export interface MockReport {
  id: string;
  name: string;
  type: ReportType;
  created: string;
  status: ReportStatus;
  summary: string;
  pages: number;
  highlights: string[];
  documentCount?: number;
  title?: string;
  created_at?: string;
  content?: string;
}

export interface InsightCategory {
  title: string;
  icon: string;
  tone: string;
  items: string[];
  evidence: string;
  page: string;
}

export interface ComparisonRow {
  label: string;
  a: string;
  b: string;
  difference?: string;
  evidence: string;
  page: string;
}

// ========== UI-specific Types ==========
export type ChatScope = 'Current Document' | 'Selected Documents' | 'All Documents';
export type FilterValue = 'All' | 'Needs Review' | 'Processed' | 'Processing';

export interface ErrorState {
  message: string;
  code?: string;
  details?: any;
}
