import { NextResponse } from "next/server";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { validateEmail } from "@/lib/validations/auth";
import { createVerificationCode } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/mail";
import { isWhitelistedAdminEmail, isSmtpConfigured } from "@/lib/env";
import { parseJsonBody, jsonError } from "@/lib/api-utils";
import User from "@/models/User";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    if (!isSmtpConfigured()) {
      return jsonError(
        "Email is not configured. Add SMTP_USER and SMTP_PASS (Gmail App Password) to .env.local and restart the server.",
        503
      );
    }

    const body = await parseJsonBody(request);
    if (!body) {
      return jsonError("Invalid JSON body", 400);
    }

    const { email, firstName, metadata } = body;

    if (!email || !validateEmail(email)) {
      return jsonError("Valid email is required", 400);
    }

    const normalized = email.toLowerCase().trim();

    if (isWhitelistedAdminEmail(normalized)) {
      return jsonError("This email is reserved for admin access. Use /admin/register", 403);
    }

    await ensureDatabase();

    const existing = await User.findOne({ email: normalized });
    if (existing) {
      return jsonError("An account with this email already exists", 409);
    }

    const code = await createVerificationCode(normalized, "register", metadata || {});
    await sendVerificationEmail(normalized, code, firstName);

    return NextResponse.json(
      {
        success: true,
        message: "Verification code sent to your email",
      },
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("[send-code]", err?.message || err);

    const dbMsg = formatDbError(err);
    if (dbMsg) {
      const status = err.code === "DB_CONN_REFUSED" || err.code === "ENV_MISSING" ? 503 : 500;
      return jsonError(dbMsg, status);
    }

    const status =
      err.code === "SMTP_NOT_CONFIGURED" || err.code === "SMTP_SEND_FAILED" ? 503 : 500;

    return jsonError(err.message || "Failed to send verification code", status);
  }
}
