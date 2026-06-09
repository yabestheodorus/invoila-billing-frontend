import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * Authenticated GET for server components. Reads the Supabase session from
 * cookies and forwards the access token to the API. Returns `fallback` on any
 * failure (no session, API down, non-2xx) so pages render instead of crashing.
 */
export async function serverFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;
    if (!token) return fallback;

    const res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}
