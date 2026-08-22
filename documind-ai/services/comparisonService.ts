import type { ComparisonRow } from '@/types';
import { demoDocuments } from '@/mockData';

export const comparisonService = {
  async compare(docAId: string, docBId: string): Promise<ComparisonRow[]> {
    // TODO: Replace with real API call: POST /api/documents/{id}/compare
    // Mock comparison data
    return [
      {
        label: 'Payment Amount',
        a: '₹50,000',
        b: '₹52,000',
        difference: '₹2,000',
        evidence: 'Total payable differs between documents',
        page: 'p. 3',
      },
      {
        label: 'Renewal Notice',
        a: '60 days',
        b: '30 days',
        difference: '30 days shorter',
        evidence: 'Notice period specified in renewal clause',
        page: 'p. 14',
      },
      {
        label: 'Supplier',
        a: 'ABC Pvt Ltd',
        b: 'ABC Pvt Ltd',
        evidence: 'Same supplier in both documents',
        page: 'pp. 1-2',
      },
      {
        label: 'Effective Date',
        a: '01 Apr 2026',
        b: '01 Apr 2026',
        evidence: 'Both documents effective same date',
        page: 'pp. 1, 2',
      },
      {
        label: 'Delivery Milestone',
        a: 'Not present',
        b: '30 Jun 2026',
        evidence: 'Milestone only in invoice',
        page: 'p. 2',
      },
    ];
  },
};
