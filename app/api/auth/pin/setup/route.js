import { cookies } from "next/headers";
import { signToken } from "@/lib/auth";
import {
  AUTH_COOKIE,
  PIN_COOKIE,
  getAuthCookieOptions,
  getPinCookieOptions,
} from "@/lib/auth-cookies";
import { buildAuthPayload } from "@/lib/auth-register";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { hashPin, validatePinFormat } from "@/lib/pin";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    if (!token) return jsonError("Not authenticated", 401);

    let session;
    try {
      session = verifyToken(token);
    } catch {
      return jsonError("Session expired. Please sign in again.", 401);
    }

    if (session.role === "admin") {
      return jsonError("PIN setup is for member accounts only", 403);
    }

    const { pin, confirmPin } = await request.json();
    const pinErr = validatePinFormat(pin);
    if (pinErr) return jsonError(pinErr, 400);
    if (pin !== confirmPin) return jsonError("PINs do not match", 400);

    await ensureDatabase();

    const user = await User.findById(session.id).select("+pinHash");
    if (!user) return jsonError("User not found", 404);
    if (user.pinSet) return jsonError("PIN already set. Use settings to change it.", 400);

    user.pinHash = await hashPin(pin);
    user.pinSet = true;
    await user.save();

    const { notifySecurityEvent } = await import("@/lib/notification-service");
    await notifySecurityEvent(user._id, {
      title: "Banking PIN created",
      message: "Your secure banking PIN was set successfully. You will need it for transfers, deposits, and withdrawals.",
      event: "pin_created",
    });

    const newToken = signToken(buildAuthPayload(user));
    const response = jsonOk({ success: true, message: "PIN created successfully" });
    response.cookies.set(AUTH_COOKIE, newToken, getAuthCookieOptions());
    response.cookies.set(PIN_COOKIE, "1", getPinCookieOptions());
    return response;
  } catch (err) {
    return jsonError(formatDbError(err) || "Could not set PIN", 500);
  }
}
