import type { MockReport, ReportType } from '@/types';

export const reportTypes: ReportType[] = [
  'Executive Summary',
  'Document Extraction Report',
  'Comparison Report',
  'Risk Assessment Report',
  'Full Intelligence Report',
];

export const mockReports: MockReport[] = [
  {
    id: 'executive-summary',
    name: 'Northstar Workspace Overview',
    type: 'Executive Summary',
    created: '18 Aug 2026 · 09:42',
    status: 'Ready',
    summary: 'A concise overview of the current document workspace, its key findings, and the decisions that need attention.',
    pages: 4,
    highlights: ['36 documents need review', 'Payment conflict identified', 'Renewal date in 28 days'],
  },
  {
    id: 'extraction-report',
    name: 'Contract & Invoice Extraction',
    type: 'Document Extraction Report',
    created: '17 Aug 2026 · 16:18',
    status: 'Ready',
    summary: 'Extracted entities, dates, amounts, and clauses from the procurement contract and linked invoice.',
    pages: 8,
    highlights: ['18 pages processed', '98% extraction confidence', '14 key fields captured'],
  },
  {
    id: 'comparison-report',
    name: 'Payment Terms Comparison',
    type: 'Comparison Report',
    created: '17 Aug 2026 · 14:06',
    status: 'Generating',
    summary: 'Side-by-side comparison of payment terms found across the sample contract and invoice records.',
    pages: 6,
    highlights: ['2 source documents', '1 value discrepancy', 'Awaiting final review'],
  },
  {
    id: 'risk-report',
    name: 'Supplier Risk Assessment',
    type: 'Risk Assessment Report',
    created: '16 Aug 2026 · 11:24',
    status: 'Failed',
    summary: 'Risk signals and review recommendations for the supplier relationship in the sample workspace.',
    pages: 0,
    highlights: ['Source data was incomplete', 'Try again after review', 'No export available'],
  },
  {
    id: 'full-intelligence',
    name: 'Full Workspace Intelligence',
    type: 'Full Intelligence Report',
    created: '15 Aug 2026 · 18:52',
    status: 'Ready',
    summary: 'A complete intelligence brief combining document summaries, extracted evidence, comparisons, and risk signals.',
    pages: 22,
    highlights: ['4 documents included', '3 linked entities', '7 evidence references'],
  },
];
