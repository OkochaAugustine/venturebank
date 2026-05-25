import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { AUTH_COOKIE, getAuthCookieOptions } from "@/lib/auth-cookies";
import { validateRegister } from "@/lib/validations/auth";
import {
  ensureDatabase,
  formatDbError,
  createMemberAccounts,
} from "@/lib/auth-helpers";
import User from "@/models/User";
import { USER_ROLES } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const errors = validateRegister(body);

    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0], errors }, { status: 400 });
    }

    await ensureDatabase();

    const email = body.email.toLowerCase().trim();
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(body.password, 12);
    const user = await User.create({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email,
      password: hashed,
      role: USER_ROLES.USER,
    });

    await createMemberAccounts(user._id);

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
    console.error("Register error:", err);
    const friendly = formatDbError(err);
    return NextResponse.json(
      { error: friendly || "Registration failed. Please try again." },
      { status: 500 }
    );
  }
}
