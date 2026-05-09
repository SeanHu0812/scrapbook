// convexAuthNextjsMiddleware requires HTTP-only cookies set by ConvexAuthNextjsProvider.
// We use ConvexAuthProvider (localStorage-based) to avoid a build-time SSR crash on
// Next.js 15. As a result, server-side middleware cannot read auth state.
//
// Fallback in use: client-side gating via <RequireAuth> in app/(private)/layout.tsx.
// Same redirect rules apply (see components/ui/RequireAuth.tsx):
//   - unauthenticated → /sign-in?next=<path>
//   - authenticated + empty name → /onboarding/profile
//   - authenticated on /sign-in|/sign-up → /home  (app/(auth)/layout.tsx)
//
// To re-enable server-side middleware if ConvexAuthNextjsProvider is fixed:
//   import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server";
//   export default convexAuthNextjsMiddleware();
//   export const config = { matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"] };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|avatars).*)"],
};
