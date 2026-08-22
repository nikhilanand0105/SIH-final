import type { GraphEntity } from '@/types';
import { graphEntities } from '@/mockData/index';

export type KnowledgeGraphRelationship = {
  id: string;
  from: string;
  to: string;
  label: string;
  detail: string;
};

export const graphRelationships: KnowledgeGraphRelationship[] = [
  {
    id: 'abc-contract',
    from: 'abc',
    to: 'contract',
    label: 'party to',
    detail: 'ABC Pvt Ltd is named as the supplier in Procurement Contract 2026.',
  },
  {
    id: 'contract-invoice',
    from: 'contract',
    to: 'invoice',
    label: 'invoiced by',
    detail: 'Invoice INV-2026-001 references the procurement contract and its payment schedule.',
  },
  {
    id: 'invoice-amount',
    from: 'invoice',
    to: 'amount',
    label: 'amount extracted',
    detail: '₹52,000 was extracted from Invoice INV-2026-001 on page 2.',
  },
];

export const graphData: GraphEntity[] = [
  graphEntities.find((entity) => entity.id === 'abc')!,
  graphEntities.find((entity) => entity.id === 'contract')!,
  {
    id: 'invoice',
    name: 'Invoice INV-2026-001',
    kind: 'Document',
    detail: 'Processed invoice linked to the supplier agreement.',
    related: ['ABC Pvt Ltd', 'Procurement Contract 2026', '₹52,000'],
  },
  graphEntities.find((entity) => entity.id === 'amount')!,
];

export const documentIdsByEntity: Record<string, string> = {
  contract: '1',
  invoice: '2',
};

export const evidenceByEntity: Record<string, string> = {
  abc: 'Mentioned in Procurement Contract 2026, page 1, and Invoice INV-2026-001, page 1.',
  contract: 'Supplier agreement reference found on pages 1 and 8 of Procurement Contract 2026.',
  invoice: 'Invoice number and supplier name confirmed on page 1; amount confirmed on page 2.',
  amount: '₹52,000 appears in the invoice total field on page 2.',
};
