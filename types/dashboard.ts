import type { ActivityEvent } from './activity';
import type { Invoice } from './invoice';

export interface DashboardSummary {
  /** Sum of settled payments (money actually collected). */
  totalCollected: number;
  /** Number of settled payments. */
  paymentsReceived: number;
  /** Sum of all unpaid invoices (pending + overdue). */
  pendingAmount: number;
  /** Count of unpaid invoices that aren't past due. */
  pendingCount: number;
  /** Sum of unpaid invoices past their due date. */
  overdueAmount: number;
  /** Count of unpaid invoices past their due date. */
  overdueCount: number;
  /** Total invoices the user has issued. */
  invoicesTotal: number;
}

/** The full dashboard payload from `GET /dashboard` (one request). */
export interface Dashboard {
  summary: DashboardSummary;
  recentInvoices: Invoice[];
  recentActivity: ActivityEvent[];
}
