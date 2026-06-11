import { redirect } from 'next/navigation';

// Root is the app entry. The marketing page now lives at `/landing`.
// (The auth middleware sends unauthenticated visitors to /login.)
export default function Home() {
  redirect('/dashboard');
}
