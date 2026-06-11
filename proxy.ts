import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * The marketing domain (e.g. "invoila.thewebstory.id"). When set, requests to
 * THIS host's root are served the landing page; the app lives on its own
 * domain at the root. Unset → no rewrite (single-domain dev/prod behaves as-is).
 */
const MARKETING_HOST = process.env.MARKETING_HOST;

// Next.js 16 renamed the `middleware` file convention to `proxy`.
export async function proxy(request: NextRequest) {
  // Marketing domain → serve the landing page at its root (URL stays clean via
  // rewrite, not redirect). `/landing` is public, so no auth gating needed here.
  const host = request.headers.get("host");
  if (MARKETING_HOST && host === MARKETING_HOST && request.nextUrl.pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/landing";
    return NextResponse.rewrite(url);
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
