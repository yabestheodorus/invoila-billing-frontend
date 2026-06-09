import type { Metadata } from 'next';
import { CustomersView } from '@/components/customers/CustomersView';
import { getCustomers } from '@/lib/api/server';

export const metadata: Metadata = {
  title: 'Customers · Invoila',
};

export default async function CustomersPage() {
  const customers = await getCustomers();
  return <CustomersView customers={customers} />;
}
