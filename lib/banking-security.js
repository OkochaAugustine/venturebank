import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { PIN_COOKIE } from "@/lib/auth-cookies";
import User from "@/models/User";
import { verifyPinHash } from "@/lib/pin";

export async function requirePinSession() {
  const cookieStore = await cookies();
  const pinSession = cookieStore.get(PIN_COOKIE)?.value;
  if (!pinSession) {
    return { ok: false, error: "PIN verification required. Sign in and enter your banking PIN.", status: 403 };
  }
  return { ok: true };
}

export async function verifyPinOnly(userId, { pin }) {
  if (!pin) {
    return { ok: false, error: "Invalid banking PIN", status: 400 };
  }

  const user = await User.findById(userId).select("+pinHash +email +firstName +lastName");
  if (!user) {
    return { ok: false, error: "User not found", status: 404 };
  }
  if (!user.pinSet) {
    return { ok: false, error: "Create your banking PIN before making transactions", status: 403 };
  }

  const pinValid = await verifyPinHash(pin, user.pinHash);
  if (!pinValid) {
    return { ok: false, error: "Invalid banking PIN", status: 401 };
  }

  return { ok: true, user };
}

// Legacy: kept for backward compatibility if needed
export async function verifyTransactionAuth(userId, { pin }) {
  return verifyPinOnly(userId, { pin });
}

export function generateReference(prefix = "TXN") {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
