import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import {
  AUTH_COOKIE,
  PIN_COOKIE,
  getAuthCookieOptions,
  getPinCookieOptions,
} from "@/lib/auth-cookies";
import { buildAuthPayload, assertMemberEmailAllowed } from "@/lib/auth-register";
import { ensureDatabase, formatDbError, createMemberAccounts } from "@/lib/auth-helpers";
import { verifyCode } from "@/lib/verification";
import { validateRegister } from "@/lib/validations/auth";
import { sendWelcomeAccountEmail } from "@/lib/mail";
import User from "@/models/User";
import { USER_ROLES } from "@/lib/constants";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const errors = validateRegister(body);
    if (errors.length > 0) {
      return jsonError(errors[0], 400, { errors });
    }

    if (!body.verificationCode) {
      return jsonError("Verification code is required", 400);
    }

    await ensureDatabase();

    const verified = await verifyCode(body.email, body.verificationCode, "register");
    if (!verified.ok) {
      return jsonError(verified.error, 400);
    }

    const email = body.email.toLowerCase().trim();

    try {
      assertMemberEmailAllowed(email);
    } catch (e) {
      return jsonError(e.message, 403);
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return jsonError("Account already exists. Sign in instead.", 409);
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
      pinSet: false,
      securityQuestion: body.securityQuestion,
      securityAnswer: securityAnswerHash,
    });

    const accounts = await createMemberAccounts(user._id);
    const primary = accounts[0];

    let emailSent = false;
    try {
      await sendWelcomeAccountEmail({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        accountNumber: primary?.accountNumber,
        accountType: primary?.name || "Primary Checking",
        status: "Active",
      });
      emailSent = true;
    } catch (mailErr) {
      console.error("Welcome email failed:", mailErr.message);
    }

    const token = signToken(buildAuthPayload(user));

    const response = jsonOk({
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      emailSent,
      requiresPinSetup: true,
      redirect: "/setup-pin",
      accountNumber: primary?.accountNumber,
    });

    response.cookies.set(AUTH_COOKIE, token, getAuthCookieOptions());
    response.cookies.set(PIN_COOKIE, "", { ...getPinCookieOptions(), maxAge: 0 });
    return response;
  } catch (err) {
    return jsonError(formatDbError(err) || "Registration failed", 500);
  }
}
