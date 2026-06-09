export type PaymentMethod = 'bank_transfer' | 'ewallet' | 'credit_card' | 'qris';
export type PaymentStatus = 'pending' | 'settlement' | 'failed' | 'refund';

/** A payment row in the payments table. */
export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  /** Coarse channel; null when Midtrans sent something we don't bucket. */
  method: PaymentMethod | null;
  status: PaymentStatus;
  /** ISO datetime string, or null when not settled yet. */
  paidAt: string | null;
}

/** Everything captured from the Midtrans response, for the detail page. */
export interface PaymentDetail extends Payment {
  orderId: string;
  transactionId: string;
  currency: string;
  paymentType: string | null;
  transactionStatus: string;
  fraudStatus: string | null;
  statusCode: string | null;
  statusMessage: string | null;
  bank: string | null;
  vaNumber: string | null;
  billerCode: string | null;
  billKey: string | null;
  store: string | null;
  maskedCard: string | null;
  cardType: string | null;
  approvalCode: string | null;
  /** ISO datetime strings, or null. */
  transactionTime: string | null;
  settlementTime: string | null;
  expiryTime: string | null;
  createdAt: string;
  updatedAt: string;
  /** The full raw Midtrans notification payload (audit trail). */
  raw: Record<string, unknown> | null;
}
