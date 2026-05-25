import bcrypt from "bcryptjs";

export function validatePinFormat(pin) {
  const s = String(pin || "").trim();
  if (!/^\d{4,6}$/.test(s)) {
    return "PIN must be 4–6 digits";
  }
  return null;
}

export async function hashPin(pin) {
  return bcrypt.hash(String(pin).trim(), 10);
}

export async function verifyPinHash(pin, hash) {
  if (!hash) return false;
  return bcrypt.compare(String(pin).trim(), hash);
}
