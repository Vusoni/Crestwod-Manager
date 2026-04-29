import type { Document } from '@/types/business';
import { SEED_DOCUMENTS } from '@/lib/mock/seedDocuments';

const documents: Document[] = [...SEED_DOCUMENTS];

const tick = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

export async function getDocuments(): Promise<Document[]> {
  await tick();
  return documents.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function getDocumentById(id: string): Promise<Document | null> {
  await tick();
  return documents.find((d) => d.id === id) ?? null;
}

export type NewDocumentInput = Omit<Document, 'id' | 'createdAt'>;

export async function addDocument(input: NewDocumentInput): Promise<Document> {
  await tick();
  const next: Document = {
    ...input,
    id: `d_${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
  };
  documents.unshift(next);
  return next;
}

export async function updateDocument(
  id: string,
  patch: Partial<Omit<Document, 'id' | 'createdAt'>>,
): Promise<Document> {
  await tick();
  const idx = documents.findIndex((d) => d.id === id);
  if (idx < 0) throw new Error(`Document not found: ${id}`);
  const current = documents[idx];
  if (!current) throw new Error(`Document not found: ${id}`);
  const next: Document = { ...current, ...patch };
  documents[idx] = next;
  return next;
}

export async function deleteDocument(id: string): Promise<void> {
  await tick();
  const idx = documents.findIndex((d) => d.id === id);
  if (idx >= 0) documents.splice(idx, 1);
}
