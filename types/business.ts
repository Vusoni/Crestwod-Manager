import type { Business } from './netWorth';

export type DocumentType = 'pdf' | 'image' | 'note' | 'link';

export type DocumentCategory =
  | 'pitch'
  | 'financial'
  | 'legal'
  | 'screenshot'
  | 'note'
  | 'other';

export interface Document {
  id: string;
  businessId: Business['id'];
  name: string;
  type: DocumentType;
  category: DocumentCategory;
  url?: string;
  content?: string;
  size?: number;
  isInvestorReady: boolean;
  notes?: string;
  createdAt: string;
}

export type DocumentFilter = 'all' | DocumentCategory;

export const DOCUMENT_FILTERS: ReadonlyArray<{ value: DocumentFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'pitch', label: 'Pitch' },
  { value: 'financial', label: 'Financial' },
  { value: 'legal', label: 'Legal' },
  { value: 'other', label: 'Other' },
];

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  pitch: 'Pitch',
  financial: 'Financial',
  legal: 'Legal',
  screenshot: 'Screenshot',
  note: 'Note',
  other: 'Other',
};
