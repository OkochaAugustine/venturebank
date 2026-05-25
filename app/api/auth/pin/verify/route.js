import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { AUTH_COOKIE, PIN_COOKIE, getPinCookieOptions } from "@/lib/auth-cookies";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { verifyPinHash } from "@/lib/pin";
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
      return jsonError("Use admin sign-in", 403);
    }

    if (!session.pinSet) {
      return jsonError("Create your PIN first", 400, { redirect: "/setup-pin" });
    }

    const { pin } = await request.json();
    if (!pin) return jsonError("PIN is required", 400);

    await ensureDatabase();

    const user = await User.findById(session.id).select("+pinHash");
    if (!user?.pinHash) return jsonError("PIN not configured", 400);

    const valid = await verifyPinHash(pin, user.pinHash);
    if (!valid) return jsonError("Incorrect PIN", 401);

    const response = jsonOk({ success: true });
    response.cookies.set(PIN_COOKIE, "1", getPinCookieOptions());
    return response;
  } catch (err) {
    return jsonError(formatDbError(err) || "PIN verification failed", 500);
  }
}
