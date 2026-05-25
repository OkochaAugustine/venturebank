import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { AUTH_COOKIE, getAuthCookieOptions } from "@/lib/auth-cookies";
import { validateLogin } from "@/lib/validations/auth";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const errors = validateLogin(body);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }

    await ensureDatabase();

    const user = await User.findOne({
      email: body.email.toLowerCase().trim(),
    }).select("+password");

    if (user?.role === "admin") {
      return NextResponse.json(
        { error: "Use the admin sign-in page at /admin/login" },
        { status: 403 }
      );
    }

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Account is disabled. Contact support." },
        { status: 403 }
      );
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(AUTH_COOKIE, token, getAuthCookieOptions());
    return response;
  } catch (err) {
    console.error("Login error:", err);
    const friendly = formatDbError(err);
    return NextResponse.json(
      { error: friendly || "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
