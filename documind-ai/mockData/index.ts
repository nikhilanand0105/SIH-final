import type { ActivityItem, DemoUser, DocumentRecord, GraphEntity, InsightItem, NotificationItem } from '@/types';

export const demoUser: DemoUser = {
  name: 'Aarav Mehta',
  initials: 'AM',
  organization: 'Northstar Operations',
  role: 'Document Intelligence Analyst',
  lastLogin: 'Today, 09:42',
};

export const demoDocuments: DocumentRecord[] = [
  {
    id: '1',
    filename: 'Procurement Contract 2026',
    status: 'COMPLETED',
    created_at: '18 Aug 2026',
    page_count: 18,
    confidence: 94,
    category: 'Contract',
    summary: 'A supplier agreement with a payment schedule and renewal clause requiring review.',
    risk: 'Medium',
  },
  {
    id: '2',
    filename: 'Invoice INV-2026-001',
    status: 'COMPLETED',
    created_at: '17 Aug 2026',
    page_count: 3,
    confidence: 98,
    category: 'Invoice',
    summary: 'Invoice from ABC Pvt Ltd for document processing services.',
    risk: 'Low',
  },
  {
    id: '3',
    filename: 'Service Agreement',
    status: 'COMPLETED',
    created_at: '15 Aug 2026',
    page_count: 12,
    confidence: 91,
    category: 'Agreement',
    summary: 'Service terms with milestone dates, ownership language, and a notice period.',
    risk: 'Low',
  },
  {
    id: '4',
    filename: 'Government Circular - Sample',
    status: 'PROCESSING',
    created_at: '18 Aug 2026',
    page_count: 6,
    confidence: 72,
    category: 'Circular',
    summary: 'Sample circular retained for demonstrating OCR and classification progress.',
    risk: 'Medium',
  },
];

export const activity: ActivityItem[] = [
  {
    id: '1',
    title: 'Document processing completed',
    detail: 'Invoice INV-2026-001 is ready to review',
    time: '12 min ago',
    icon: 'check-circle',
    tone: 'green',
  },
  {
    id: '2',
    title: 'Potential conflict detected',
    detail: 'Payment amount differs across 2 documents',
    time: '34 min ago',
    icon: 'alert-triangle',
    tone: 'amber',
  },
  {
    id: '3',
    title: 'New document added',
    detail: 'Procurement Contract 2026',
    time: '1 hr ago',
    icon: 'file-plus',
    tone: 'blue',
  },
];

export const insights: InsightItem[] = [
  {
    id: '1',
    title: 'Payment amount needs review',
    detail: 'Two sample documents reference different payment amounts for ABC Pvt Ltd.',
    severity: 'Medium',
    source: 'Procurement Contract 2026',
  },
  {
    id: '2',
    title: 'Renewal date approaching',
    detail: 'The service agreement includes a renewal date in 28 days.',
    severity: 'Low',
    source: 'Service Agreement',
  },
];

export const dashboardMetrics = [
  { label: 'Total documents', value: '1,248', detail: 'Sample workspace', icon: 'file-text', tone: 'navy' },
  { label: 'COMPLETED', value: '1,192', detail: '95.5% of workspace', icon: 'check-circle', tone: 'green' },
  { label: 'COMPLETED', value: '36', detail: 'Human review recommended', icon: 'eye', tone: 'amber' },
  { label: 'Conflicts', value: '20', detail: 'Across sample documents', icon: 'alert-triangle', tone: 'red' },
];

export const notifications: NotificationItem[] = [
  {
    id: '1',
    category: 'Document processing',
    title: 'Document processing completed',
    detail: 'Invoice INV-2026-001 is ready to review.',
    time: '12 min ago',
    read: false,
    tone: 'green',
  },
  {
    id: '2',
    category: 'Insights',
    title: 'Potential conflict detected',
    detail: 'Payment amount differs across two sample documents.',
    time: '34 min ago',
    read: false,
    tone: 'amber',
  },
  {
    id: '3',
    category: 'Reports',
    title: 'Report is ready',
    detail: 'The sample risk assessment report can be reviewed.',
    time: 'Yesterday',
    read: true,
    tone: 'blue',
  },
];

export const graphEntities: GraphEntity[] = [
  {
    id: 'abc',
    name: 'ABC Pvt Ltd',
    kind: 'Organization',
    detail: 'Appears across three sample records.',
    related: ['Procurement Contract 2026', 'Invoice INV-2026-001', '₹52,000'],
  },
  {
    id: 'contract',
    name: 'Procurement Contract 2026',
    kind: 'Document',
    detail: 'Supplier agreement with payment and renewal terms.',
    related: ['ABC Pvt Ltd', 'Invoice INV-2026-001', '₹50,000'],
  },
  {
    id: 'amount',
    name: '₹52,000',
    kind: 'Amount',
    detail: 'Extracted from the sample invoice on page 2.',
    related: ['Invoice INV-2026-001', 'ABC Pvt Ltd'],
  },
];
