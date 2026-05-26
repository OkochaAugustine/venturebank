import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";
import { AUTH_COOKIE, PIN_COOKIE, getPinCookieOptions } from "@/lib/auth-cookies";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { hashPin, validatePinFormat } from "@/lib/pin";
import User from "@/models/User";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

/** Recover PIN at login screen using account password (no current PIN required) */
export async function POST(request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    if (!token) return jsonError("Not authenticated", 401);

    let session;
    try {
      session = verifyToken(token);
    } catch {
      return jsonError("Session expired", 401);
    }

    const { password, newPin, confirmPin } = await request.json();
    const pinErr = validatePinFormat(newPin);
    if (pinErr) return jsonError(pinErr, 400);
    if (newPin !== confirmPin) return jsonError("PINs do not match", 400);
    if (!password) return jsonError("Password is required", 400);

    await ensureDatabase();

    const user = await User.findById(session.id).select("+password +pinHash");
    if (!user) return jsonError("User not found", 404);

    if (!(await bcrypt.compare(password, user.password))) {
      return jsonError("Password is incorrect", 401);
    }

    user.pinHash = await hashPin(newPin);
    user.pinSet = true;
    await user.save();

    const { notifySecurityEvent } = await import("@/lib/notification-service");
    await notifySecurityEvent(session.id, {
      title: "Banking PIN recovered",
      message: "Your banking PIN was reset using your account password. If this wasn't you, contact support immediately.",
      event: "pin_recover",
    });

    const response = jsonOk({ success: true, message: "PIN reset. You can sign in with your new PIN." });
    response.cookies.set(PIN_COOKIE, "1", getPinCookieOptions());
    return response;
  } catch (err) {
    return jsonError(formatDbError(err) || "Recovery failed", 500);
  }
}
