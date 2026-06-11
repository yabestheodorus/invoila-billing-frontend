import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Two-domain setup (both optional — unset → ordinary single-domain behaviour):
 *
 * - `MARKETING_HOST` — the marketing domain (e.g. "invoila.thewebstory.id"). It
 *   serves ONLY the landing page: its root is rewritten to `/landing`, and every
 *   other path is redirected to the app (same path) so the landing's relative
 *   CTAs (Sign in / Get started) bounce users onto the real app.
 * - `APP_URL` — the app's base URL (e.g. "https://app-invoila.thewebstory.id"),
 *   the redirect target for non-landing paths hit on the marketing domain.
 */
const MARKETING_HOST = process.env.MARKETING_HOST;
const APP_URL = process.env.APP_URL;

// Next.js 16 renamed the `middleware` file convention to `proxy`.
export async function proxy(request: NextRequest) {
  // Prefer the forwarded host (set by the platform's edge/CDN) over the raw one.
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (MARKETING_HOST && host === MARKETING_HOST) {
    const { pathname, search } = request.nextUrl;

    // Marketing root → the landing page (clean URL via rewrite, not redirect).
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/landing";
      return NextResponse.rewrite(url);
    }

    // Everything else belongs to the app → redirect to the app domain, same
    // path (`/landing` itself is served as-is). Only when APP_URL is configured;
    // otherwise fall through so the marketing host degrades to single-domain.
    if (APP_URL && pathname !== "/landing") {
      return NextResponse.redirect(`${APP_URL}${pathname}${search}`, 307);
    }
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on everything except Next internals and static assets, so every
     * page request is auth-checked. (Public routes are allow-listed inside
     * `updateSession`.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
