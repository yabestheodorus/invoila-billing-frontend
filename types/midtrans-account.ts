/** Midtrans merchant connection — view models for Settings. */

export type MidtransEnvironment = 'sandbox' | 'production';

/**
 * Masked status returned by the API. The server key is never sent back in
 * plaintext — only whether one is configured plus a masked hint.
 */
export interface MidtransAccountView {
  merchantId: string;
  clientKey: string;
  environment: MidtransEnvironment;
  serverKeyConfigured: boolean;
  serverKeyMasked: string;
}

/** The create/update payload (mirrors the backend schema). */
export interface MidtransAccountInput {
  merchantId: string;
  serverKey: string;
  clientKey: string;
  environment: MidtransEnvironment;
}
