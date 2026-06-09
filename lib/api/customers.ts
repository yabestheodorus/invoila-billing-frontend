import type { Customer } from '@/types/customer';
import type { Party } from '@/types/invoice';
import { browserFetch } from './browser-fetch';

/** Create a customer (client-side). Input matches the billed-party shape. */
export function createCustomer(input: Party): Promise<Customer> {
  return browserFetch<Customer>('/customers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
