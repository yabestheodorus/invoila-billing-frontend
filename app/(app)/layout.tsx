import { cookies } from 'next/headers';
import { Sidebar } from '@/components/shared/Sidebar';
import { Topbar } from '@/components/shared/Topbar';
import { createClient } from '@/lib/supabase/server';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  // Display only — read the session from the cookie locally (no network / no
  // JWT verification). The backend validates the token on API calls.
  const supabase = createClient(await cookies());
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userName = session?.user?.email?.split('@')[0] ?? 'Account';

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userName={userName} />
        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
