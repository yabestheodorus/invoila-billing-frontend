import { type NextRequest, NextResponse } from "next/server";

/** Routes reachable without authentication. */
const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
];

function isPublicPath(pathname: string): boolean {
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return true;
  }
  // Public customer payment page (no auth chrome).
  if (pathname === '/pay' || pathname.startsWith('/pay/')) return true;
  return false;
}

/**
 * Cheap presence check for the Supabase session cookie
 * (`sb-<projectRef>-auth-token`, possibly chunked into `.0`, `.1`, …).
 *
 * The frontend only uses this for routing UX (redirect to /login when there's
 * no session). It does NOT verify the JWT — the backend validates the token on
 * every API call. So this stays a local cookie read with no network request,
 * instead of calling `supabase.auth.getUser()` on every page load.
 */
function hasSupabaseSession(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some((c) => c.name.startsWith('sb-') && c.name.includes('-auth-token'));
}

export function updateSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const signedIn = hasSupabaseSession(request);

  // No session cookie → only public routes are allowed.
  if (!signedIn && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Has a session → keep users away from the auth screens.
  if (signedIn && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
