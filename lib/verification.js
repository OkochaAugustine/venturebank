import VerificationCode from "@/models/VerificationCode";

const CODE_LENGTH = 6;
const EXPIRY_MINUTES = 15;
const MAX_ATTEMPTS = 5;

export function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function createVerificationCode(email, type = "register", metadata = {}) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  await VerificationCode.deleteMany({ email: email.toLowerCase(), type, verified: false });

  await VerificationCode.create({
    email: email.toLowerCase(),
    code,
    type,
    expiresAt,
    metadata,
  });

  return code;
}

export async function verifyCode(email, code, type = "register") {
  const record = await VerificationCode.findOne({
    email: email.toLowerCase(),
    type,
    verified: false,
  }).sort({ createdAt: -1 });

  if (!record) {
    return { ok: false, error: "No verification code found. Request a new code." };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: "Too many attempts. Request a new code." };
  }

  if (new Date() > record.expiresAt) {
    return { ok: false, error: "Code expired. Request a new code." };
  }

  if (record.code !== code.trim()) {
    record.attempts += 1;
    await record.save();
    return { ok: false, error: "Invalid verification code." };
  }

  record.verified = true;
  await record.save();
  return { ok: true, metadata: record.metadata };
}
