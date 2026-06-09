import { browserFetch } from './browser-fetch';
import type { BusinessProfileRecord } from './server';

/** The business-profile create/update payload (mirrors the backend schema). */
export interface BusinessProfileInput {
  name: string;
  email: string;
  line1: string;
  line2?: string;
  city: string;
  postal?: string;
  country: string;
  logoUrl?: string;
  invoicePrefix?: string;
}

/** Create or update the user's business profile (client-side). */
export function saveBusinessProfile(input: BusinessProfileInput): Promise<BusinessProfileRecord> {
  return browserFetch<BusinessProfileRecord>('/business-profile', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
