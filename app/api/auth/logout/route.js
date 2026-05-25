import { NextResponse } from "next/server";
import { AUTH_COOKIE, getAuthCookieOptions } from "@/lib/auth-cookies";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(AUTH_COOKIE, "", { ...getAuthCookieOptions(), maxAge: 0 });
  return response;
}
