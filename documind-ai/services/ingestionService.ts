import type { DocumentInput, DocumentFile, DocumentRecord } from '@/types';
import { demoDocuments } from '@/mockData';

export class IngestionService {
  static async uploadDocument(input: DocumentInput): Promise<DocumentRecord> {
    // TODO: Replace with real API call: POST /api/documents/upload
    // This should be multipart form-data with the file

    if (input.source === 'file' && input.file) {
      // Mock implementation
      const newDoc: DocumentRecord = {
        id: 'doc-' + Math.random().toString(36).substr(2, 9),
        filename: input.file.name,
        status: 'QUEUED',
        created_at: new Date().toISOString(),
        page_count: Math.floor(Math.random() * 20) + 1,
        confidence: Math.floor(Math.random() * 30) + 70,
        category: 'Document',
        summary: 'Document queued for processing...',
        risk: 'Medium',
      };
      return newDoc;
    }

    if (input.source === 'camera') {
      // Mock camera capture
      const newDoc: DocumentRecord = {
        id: 'doc-' + Math.random().toString(36).substr(2, 9),
        filename: 'Camera_' + new Date().toISOString().split('T')[0] + '.jpg',
        status: 'QUEUED',
        created_at: new Date().toISOString(),
        page_count: 1,
        confidence: 85,
        category: 'Scanned',
        summary: 'Scanned document queued for OCR processing...',
        risk: 'Low',
      };
      return newDoc;
    }

    throw new Error('Invalid document input source');
  }

  static async getProcessingStatus(documentId: string): Promise<{
    status: string;
    stage: string;
    progress: number;
    message: string;
  }> {
    // TODO: Replace with real API call: GET /api/documents/{id}/status
    // Mock status progression
    const stages = ['QUEUED', 'EXTRACTING', 'CHUNKING', 'EMBEDDING', 'ANALYZING', 'COMPLETED'];
    const randomStage = stages[Math.floor(Math.random() * stages.length)];
    const progress = Math.random();

    return {
      status: 'PROCESSING',
      stage: randomStage,
      progress,
      message: `Processing stage: ${randomStage}`,
    };
  }
}
