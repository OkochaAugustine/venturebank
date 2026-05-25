import { NextResponse } from "next/server";
import { signToken } from "@/lib/auth";
import { AUTH_COOKIE, getAuthCookieOptions } from "@/lib/auth-cookies";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { isWhitelistedAdminEmail } from "@/lib/env";
import { ensureAdminUser } from "@/lib/admin-auth";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Email and password (min 8 chars) required" },
        { status: 400 }
      );
    }

    const normalized = email.toLowerCase().trim();

    if (!isWhitelistedAdminEmail(normalized)) {
      return NextResponse.json(
        { error: "Only whitelisted admin emails may register." },
        { status: 403 }
      );
    }

    await ensureDatabase();

    const existing = await User.findOne({ email: normalized });
    if (existing && existing.role !== "admin") {
      return NextResponse.json(
        { error: "Email is already registered as a member account." },
        { status: 409 }
      );
    }

    const user = await ensureAdminUser(
      normalized,
      password,
      firstName?.trim() || "Admin",
      lastName?.trim() || "User"
    );

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set(AUTH_COOKIE, token, getAuthCookieOptions());
    return response;
  } catch (err) {
    return NextResponse.json(
      { error: err.message || formatDbError(err) || "Registration failed" },
      { status: 500 }
    );
  }
}
