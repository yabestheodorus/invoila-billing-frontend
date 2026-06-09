import { browserFetch } from './browser-fetch';
import type {
  MidtransAccountInput,
  MidtransAccountView,
} from '@/types/midtrans-account';

/**
 * Connect / update the user's Midtrans merchant (client-side write).
 *
 * The server-side read lives in `lib/api/server.ts` (`getMidtransAccount`) — it
 * must NOT be imported here, since this module is pulled into the client bundle
 * and `server-fetch` depends on `next/headers` (server-only).
 */
export function saveMidtransAccount(
  input: MidtransAccountInput,
): Promise<MidtransAccountView> {
  return browserFetch<MidtransAccountView>('/midtrans-account', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
