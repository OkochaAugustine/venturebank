import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { AUTH_COOKIE, getAuthCookieOptions } from "@/lib/auth-cookies";
import { buildAuthPayload } from "@/lib/auth-register";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { isWhitelistedAdminEmail } from "@/lib/env";
import User from "@/models/User";
import { USER_ROLES } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const normalized = email.toLowerCase().trim();

    if (!isWhitelistedAdminEmail(normalized)) {
      return NextResponse.json(
        { error: "This email is not authorized for admin access." },
        { status: 403 }
      );
    }

    await ensureDatabase();

    const user = await User.findOne({ email: normalized })
      .select("+password")
      .exec();

    if (!user || user.role !== USER_ROLES.ADMIN) {
      return NextResponse.json(
        { error: "Invalid admin credentials. Register first at /admin/register" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "Account is disabled" }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(buildAuthPayload(user));

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    response.cookies.set(AUTH_COOKIE, token, getAuthCookieOptions());
    return response;
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Login failed" }, { status: 500 });
  }
}
