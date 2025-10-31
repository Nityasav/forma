import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/auth/login", "/auth/signup", "/auth/verify", "/auth/callback"];

export function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const session = cookies.get("sb-forma-auth-session");
  const isAuthenticated = Boolean(session?.value);

  const isAuthRoute = PUBLIC_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route),
  );
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isRoot = nextUrl.pathname === "/";

  if (!isAuthenticated && (isDashboardRoute || isRoot)) {
    const redirectUrl = new URL("/auth/login", request.url);
    redirectUrl.searchParams.set("redirect", nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/:path*"],
};

