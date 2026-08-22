import type { DocumentRecord } from '@/types';
import { demoDocuments } from '@/mockData';

export const documentService = {
  async list(): Promise<DocumentRecord[]> {
    // TODO: Replace with real API call: GET /api/documents
    return demoDocuments;
  },

  async get(id: string): Promise<DocumentRecord | null> {
    // TODO: Replace with real API call: GET /api/documents/{id}
    return demoDocuments.find(doc => doc.id === id) || null;
  },

  async delete(id: string): Promise<void> {
    // TODO: Replace with real API call: DELETE /api/documents/{id}
    console.log('Delete document:', id);
  },

  async reprocess(id: string): Promise<void> {
    // TODO: Replace with real API call: POST /api/documents/{id}/reprocess
    console.log('Reprocess document:', id);
  },
};
