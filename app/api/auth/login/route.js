import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import {
  AUTH_COOKIE,
  PIN_COOKIE,
  getAuthCookieOptions,
  getPinCookieOptions,
} from "@/lib/auth-cookies";
import { buildAuthPayload } from "@/lib/auth-register";
import { validateLogin } from "@/lib/validations/auth";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import User from "@/models/User";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const errors = validateLogin(body);

    if (errors.length > 0) {
      return jsonError(errors[0], 400, { errors });
    }

    await ensureDatabase();

    const user = await User.findOne({
      email: body.email.toLowerCase().trim(),
    }).select("+password");

    if (user?.role === "admin") {
      return jsonError("Use the admin sign-in page at /admin/login", 403);
    }

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return jsonError("Invalid email or password", 401);
    }

    if (!user.isActive) {
      return jsonError("Account is disabled. Contact support.", 403);
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signToken(buildAuthPayload(user));

    const response = jsonOk({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        pinSet: user.pinSet,
      },
      requiresPinSetup: !user.pinSet,
      requiresPinVerify: Boolean(user.pinSet),
      redirect: !user.pinSet ? "/setup-pin" : "/verify-pin",
    });

    response.cookies.set(AUTH_COOKIE, token, getAuthCookieOptions());
    response.cookies.set(PIN_COOKIE, "", { ...getPinCookieOptions(), maxAge: 0 });
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return jsonError(formatDbError(err) || "Login failed. Please try again.", 500);
  }
}
