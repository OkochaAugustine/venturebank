/**
 * All configuration is read from .env.local only (Next.js loads it automatically).
 * Never commit .env.local — use .env.local.example as a template.
 */

export function getMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not defined. Add it to .env.local: MONGODB_URI=your-mongodb-connection-string"
    );
  }
  return uri;
}

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in .env.local");
  }
  return secret;
}

/** Middleware/build-safe — never use for signing tokens */
export function getJwtSecretOrPlaceholder() {
  return process.env.JWT_SECRET?.trim() || "venturebank-build-placeholder-min-32-chars";
}

export function getPaystackPublicKey() {
  const key =
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY?.trim() ||
    process.env.PAYSTACK_PUBLIC_KEY?.trim();
  if (!key) {
    throw new Error(
      "PAYSTACK public key is not defined. Add NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY or PAYSTACK_PUBLIC_KEY to .env.local"
    );
  }
  return key;
}

export function getPaystackSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("PAYSTACK secret key is not defined. Add PAYSTACK_SECRET_KEY to .env.local");
  }
  return key;
}

export function getPaystackWebhookSecret() {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET?.trim();
  if (!secret) {
    throw new Error("PAYSTACK webhook secret is not defined. Add PAYSTACK_WEBHOOK_SECRET to .env.local");
  }
  return secret;
}

export function isDbConfigured() {
  return Boolean(process.env.MONGODB_URI?.trim());
}

/** Comma-separated list of exactly two admin emails allowed to access /admin */
export function getAdminWhitelist() {
  const raw =
    process.env.ADMIN_WHITELIST_EMAILS?.trim() ||
    "okochaaugustine158@gmail.com";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isWhitelistedAdminEmail(email) {
  if (!email) return false;
  return getAdminWhitelist().includes(email.toLowerCase().trim());
}

export function getSmtpConfig() {
  return {
    host: process.env.SMTP_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER?.trim() || "",
    pass: process.env.SMTP_PASS?.trim() || "",
    from:
      process.env.SMTP_FROM?.trim() ||
      (process.env.SMTP_USER
        ? `"VentureBank" <${process.env.SMTP_USER.trim()}>`
        : ""),
  };
}

export function isSmtpConfigured() {
  const { user, pass } = getSmtpConfig();
  return Boolean(user && pass);
}
