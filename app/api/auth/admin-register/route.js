import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { AUTH_COOKIE, getAuthCookieOptions } from "@/lib/auth-cookies";
import { buildAuthPayload } from "@/lib/auth-register";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { ensureAdminUser } from "@/lib/admin-auth";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || password.length < 8) {
      return jsonError("Email and password (min 8 characters) are required", 400);
    }

    await ensureDatabase();

    const { user, upgraded, updated } = await ensureAdminUser(
      email,
      password,
      firstName?.trim() || "Admin",
      lastName?.trim() || "User"
    );

    const token = signToken(buildAuthPayload(user));

    const message = upgraded
      ? "Member account upgraded to administrator. You can sign in at /admin/login."
      : updated
        ? "Admin credentials updated."
        : "Admin account created successfully.";

    const response = jsonOk({ success: true, message, upgraded });
    response.cookies.set(AUTH_COOKIE, token, getAuthCookieOptions());
    return response;
  } catch (err) {
    if (err.code === "ADMIN_NOT_WHITELISTED") {
      return jsonError(err.message, 403);
    }
    return jsonError(err.message || formatDbError(err) || "Admin registration failed", 500);
  }
}
