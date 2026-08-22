export type ComparisonRow = {
  label: string;
  a: string;
  b: string;
  difference?: string;
  evidence: string;
  page: string;
};

export const comparisonSummary =
  'The invoice and procurement contract reference the same supplier, but the payment amount and renewal language differ. One new delivery milestone appears only in the invoice.';

export const comparisonData = {
  summary: comparisonSummary,
  changed: [
    {
      label: 'Payment Amount',
      a: '₹50,000',
      b: '₹55,000',
      difference: '₹5,000',
      evidence: 'Total payable is stated as fifty-five thousand rupees.',
      page: 'p. 2 · line 18',
    },
    {
      label: 'Renewal Notice',
      a: '60 days',
      b: '30 days',
      difference: '30 days shorter',
      evidence: 'Either party may terminate with thirty days written notice.',
      page: 'p. 14 · clause 4.3',
    },
  ] as ComparisonRow[],
  added: [
    {
      label: 'Delivery milestone',
      a: 'Not present',
      b: '30 Jun 2026',
      evidence: 'First delivery milestone due by 30 June 2026.',
      page: 'p. 2 · line 11',
    },
    {
      label: 'Late fee',
      a: 'Not present',
      b: '1.5% monthly',
      evidence: 'Late payments incur a 1.5% monthly service charge.',
      page: 'p. 3 · clause 6',
    },
  ] as ComparisonRow[],
  removed: [
    {
      label: 'Annual cap',
      a: '₹600,000',
      b: 'Not present',
      evidence: 'Annual fees shall not exceed six lakh rupees.',
      page: 'p. 7 · clause 8.1',
    },
  ] as ComparisonRow[],
  unchanged: [
    {
      label: 'Supplier',
      a: 'ABC Pvt Ltd',
      b: 'ABC Pvt Ltd',
      evidence: 'Supplier name appears in both source headers.',
      page: 'pp. 1, 2',
    },
    {
      label: 'Effective date',
      a: '01 Apr 2026',
      b: '01 Apr 2026',
      evidence: 'Both documents identify 01 April 2026 as the effective date.',
      page: 'pp. 1, 2',
    },
  ] as ComparisonRow[],
};
