/**
 * Invoice draft persistence — currently localStorage, shaped like a future API
 * (`list / get / save / remove`) so it can be swapped for a backend (e.g. a
 * `status='draft'` invoice in the DB) by replacing only this module. Drafts hold
 * raw, possibly-incomplete {@link InvoiceFormValues} and survive browser
 * restarts; a draft is removed once its invoice is sent to the backend.
 *
 * All functions are SSR-safe (no-op / empty on the server) and synchronous;
 * wrap the calls in `Promise.resolve` at the call site if/when this goes async.
 */
import type { InvoiceFormValues } from '@/types/invoice-form';

export interface InvoiceDraft {
  id: string;
  values: InvoiceFormValues;
  /** ISO datetime of the last save. */
  savedAt: string;
}

const KEY = 'invoila:invoice-drafts';

function read(): InvoiceDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as InvoiceDraft[]) : [];
  } catch {
    return [];
  }
}

function write(drafts: InvoiceDraft[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(drafts));
}

function newId(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `draft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** All drafts, most recently saved first. */
export function listDrafts(): InvoiceDraft[] {
  return read().sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function getDraft(id: string): InvoiceDraft | null {
  return read().find((d) => d.id === id) ?? null;
}

/** Create a draft, or overwrite the one matching `id`. Returns the saved draft. */
export function saveDraft(values: InvoiceFormValues, id?: string): InvoiceDraft {
  const drafts = read();
  const savedAt = new Date().toISOString();

  if (id) {
    const idx = drafts.findIndex((d) => d.id === id);
    if (idx !== -1) {
      const updated: InvoiceDraft = { ...drafts[idx], values, savedAt };
      drafts[idx] = updated;
      write(drafts);
      return updated;
    }
  }

  const draft: InvoiceDraft = { id: id ?? newId(), values, savedAt };
  drafts.push(draft);
  write(drafts);
  return draft;
}

export function removeDraft(id: string): void {
  write(read().filter((d) => d.id !== id));
}
