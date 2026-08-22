import type { InsightCategory } from '@/types';

export const documentInsightCategories: InsightCategory[] = [
  {
    title: 'Potential Conflicts',
    icon: 'alert-triangle',
    tone: 'warning',
    items: ['Renewal notice is shorter than team standard'],
    evidence: '30 days versus internal 60-day review standard',
    page: 'p. 14',
  },
  {
    title: 'Important Deadlines',
    icon: 'calendar',
    tone: 'info',
    items: ['Renewal review due 01 Mar 2027'],
    evidence: '12-month term begins 01 Apr 2026',
    page: 'p. 14 · clause 4.2',
  },
  {
    title: 'Risk Indicators',
    icon: 'alert-circle',
    tone: 'danger',
    items: ['Termination window may limit negotiation time'],
    evidence: 'Written notice required thirty days before termination',
    page: 'p. 14 · clause 4.3',
  },
  {
    title: 'Action Items',
    icon: 'check-square',
    tone: 'success',
    items: ['Confirm notice period with legal', 'Add renewal reminder'],
    evidence: 'Action derived from notice and renewal clauses',
    page: 'p. 14',
  },
  {
    title: 'Key Entities',
    icon: 'users',
    tone: 'info',
    items: ['ABC Pvt Ltd · Supplier', 'Priya Shah · Document owner'],
    evidence: 'Supplier and owner fields extracted from contract',
    page: 'p. 2 · line 14',
  },
  {
    title: 'Unusual Information',
    icon: 'info',
    tone: 'info',
    items: ['Monthly value is listed without annual cap'],
    evidence: '₹52,000 monthly recurring value',
    page: 'p. 3 · line 08',
  },
];

export const extractedFields = [
  { label: 'Supplier', value: 'ABC Pvt Ltd', page: 'p. 2 · line 14', confidence: '98%' },
  { label: 'Monthly value', value: '₹52,000', page: 'p. 3 · line 08', confidence: '97%' },
  { label: 'Renewal term', value: '12 months', page: 'p. 14 · clause 4.2', confidence: '91%' },
  { label: 'Notice period', value: '30 days', page: 'p. 14 · clause 4.3', confidence: '89%' },
];
