/** A saved customer (master data) that can be billed on an invoice. */
export interface Customer {
  id: string;
  name: string;
  email: string;
  line1: string;
  /** Optional address fields are `null` (not omitted) when unset by the API. */
  line2: string | null;
  city: string;
  postal: string | null;
  country: string;
}
