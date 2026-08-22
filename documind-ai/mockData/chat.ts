export type ChatScope = 'Current Document' | 'Selected Documents' | 'All Documents';

export const currentDocumentQuestions = [
  'What is this document about?',
  'Summarize this document.',
  'What are the important dates?',
  'Who are the parties?',
  'What are the financial amounts?',
  'Are there inconsistencies?',
  'What are the risks?',
];

export const crossDocumentQuestions = [
  'Which contracts expire this year?',
  'Are there conflicting amounts?',
  'Which documents mention this organization?',
];

export const chatResponses: Record<ChatScope, { answer: string; source: string; confidence: number }> = {
  'Current Document': {
    answer:
      'This is a recurring services agreement between your team and ABC Pvt Ltd. It establishes a ₹52,000 monthly value, a 12-month term, and a 30-day termination notice.',
    source: 'Procurement Contract 2026 · pp. 2–3, 14',
    confidence: 95,
  },
  'Selected Documents': {
    answer:
      'Across the selected source set, ABC Pvt Ltd appears in the procurement contract and invoice. The contract renews in 2027; one conflicting monthly amount was found in the available pages.',
    source: '2 documents · pp. 2, 3, 14',
    confidence: 92,
  },
  'All Documents': {
    answer:
      'Across the workspace, ABC Pvt Ltd appears in three sample records. Payment amounts differ between the contract and invoice and should be reviewed before approval.',
    source: '4 documents · multi-document scope',
    confidence: 91,
  },
};
