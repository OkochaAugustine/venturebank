import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { AUTH_COOKIE, getAuthCookieOptions } from "@/lib/auth-cookies";
import { ensureDatabase, formatDbError, createMemberAccounts } from "@/lib/auth-helpers";
import { verifyCode } from "@/lib/verification";
import { validateRegister } from "@/lib/validations/auth";
import { isWhitelistedAdminEmail } from "@/lib/env";
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

    if (!body.verificationCode) {
      return NextResponse.json({ error: "Verification code is required" }, { status: 400 });
    }

    await ensureDatabase();

    const verified = await verifyCode(body.email, body.verificationCode, "register");
    if (!verified.ok) {
      return NextResponse.json({ error: verified.error }, { status: 400 });
    }

    const email = body.email.toLowerCase().trim();

    if (isWhitelistedAdminEmail(email)) {
      return NextResponse.json(
        { error: "This email is reserved for admin access. Use /admin/register" },
        { status: 403 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Account already exists" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(body.password, 12);
    const securityAnswerHash = body.securityAnswer
      ? await bcrypt.hash(body.securityAnswer.toLowerCase().trim(), 10)
      : undefined;

    const user = await User.create({
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email,
      password: hashed,
      phone: body.phone?.trim(),
      role: USER_ROLES.USER,
      emailVerified: true,
      securityQuestion: body.securityQuestion,
      securityAnswer: securityAnswerHash,
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
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    response.cookies.set(AUTH_COOKIE, token, getAuthCookieOptions());
    return response;
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Registration failed" }, { status: 500 });
  }
}
