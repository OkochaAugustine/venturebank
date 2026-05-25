import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { AUTH_COOKIE } from "@/lib/auth-cookies";
import { getJwtSecretOrPlaceholder } from "@/lib/env";

const protectedPaths = ["/dashboard", "/admin"];
const memberAuthPaths = ["/login", "/register"];
const adminAuthPaths = ["/admin/login", "/admin/register"];

function getSecret() {
  return new TextEncoder().encode(getJwtSecretOrPlaceholder());
}

async function verifyAuthToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const session = token ? await verifyAuthToken(token) : null;

  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminAuthPage = adminAuthPaths.some((p) => pathname === p);
  const isAdminProtected = isAdminRoute && !isAdminAuthPage;

  const isDashboardRoute =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isMemberAuthPage = memberAuthPaths.some((p) => pathname === p);

  if (isAdminProtected && !session) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isDashboardRoute && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminProtected && session && session.role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isDashboardRoute && session?.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAdminAuthPage && session?.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isMemberAuthPage && session) {
    const dest = session.role === "admin" ? "/admin" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/admin/login",
    "/admin/register",
  ],
};
