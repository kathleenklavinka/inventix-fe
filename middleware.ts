import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  owner:    ["/dashboard", "/stock", "/penjualan", "/supplier", "/user", "/notification", "/laporan", "/profile"],
  admin:    ["/dashboard", "/stock", "/penjualan", "/supplier", "/notification", "/profile"],
  user:     ["/dashboard", "/stock", "/penjualan", "/supplier", "/notification", "/profile"],
  supplier: ["/supplier/portal"],
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const role  = request.cookies.get("role")?.value;
  const path  = request.nextUrl.pathname;

  // Belum login → ke login
  if (!token || !role) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Cek akses
  const allowed = ROLE_ROUTES[role] ?? [];
  const hasAccess = allowed.some((route) => path.startsWith(route));

  if (!hasAccess) {
    const home = role === "supplier" ? "/supplier/portal" : "/dashboard";
    const url  = new URL(home, request.url);
    url.searchParams.set("error", "forbidden");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/stock",
    "/stock/:path*",
    "/penjualan",
    "/penjualan/:path*",
    "/supplier",
    "/supplier/:path*",
    "/supplier/portal",
    "/supplier/portal/:path*",
    "/user",
    "/user/:path*",
    "/notification",
    "/notification/:path*",
    "/laporan",
    "/laporan/:path*",
    "/profile",
    "/profile/:path*",
  ],
};