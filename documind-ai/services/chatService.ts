export const chatService = {
  async ask(query: string): Promise<{ answer: string; source: string; confidence: number }> {
    // TODO: Replace with real API call: POST /api/query
    // Mock response based on demo questions
    const mockResponses: Record<string, { answer: string; source: string; confidence: number }> = {
      'payment': {
        answer: 'The payment amount is ₹50,000 based on the Procurement Contract 2026.',
        source: 'Procurement Contract 2026 · Page 3',
        confidence: 94,
      },
      'renewal': {
        answer: 'The renewal date is 28 days away from the agreement signature date in the Service Agreement.',
        source: 'Service Agreement · Page 7',
        confidence: 89,
      },
      'scope': {
        answer: 'The agreement covers document processing services with specific deliverables outlined in section 3.',
        source: 'Service Agreement · Page 2',
        confidence: 91,
      },
      'default': {
        answer: 'I am currently unable to reach the document intelligence backend. Please check your connection or ensure the server is running.',
        source: 'System Error',
        confidence: 0,
      },
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, response] of Object.entries(mockResponses)) {
      if (key !== 'default' && lowerQuery.includes(key)) {
        return response;
      }
    }
    return mockResponses['default'];
  },
};
