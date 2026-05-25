import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";
import { getSmtpConfig, isSmtpConfigured } from "@/lib/env";

function createTransport() {
  if (!isSmtpConfigured()) {
    return null;
  }

  const smtp = getSmtpConfig();
  const pass = smtp.pass.replace(/\s/g, "");

  if (smtp.host.includes("gmail") || smtp.user.includes("@gmail.com")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtp.user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass,
    },
  });
}

export async function sendVerificationEmail(email, code, firstName) {
  const transport = createTransport();
  const smtp = getSmtpConfig();
  const name = firstName || "Member";
  const subject = `${siteConfig.name} — Your verification code`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f8fafc;">
      <div style="background:#fff;border-radius:12px;padding:32px;border:1px solid #e2e8f0;">
        <h1 style="color:#0369a1;font-size:22px;margin:0 0 16px;">Verify your identity</h1>
        <p style="color:#334155;">Hello ${name},</p>
        <p style="color:#334155;">Use this code to complete your ${siteConfig.name} registration:</p>
        <p style="font-size:36px;font-weight:700;letter-spacing:10px;color:#0284c7;text-align:center;margin:24px 0;">${code}</p>
        <p style="color:#64748b;font-size:14px;">Expires in 15 minutes. Never share this code.</p>
      </div>
    </div>
  `;

  if (!transport) {
    const err = new Error(
      "Email is not configured. Add SMTP_USER and SMTP_PASS to .env.local and restart the server."
    );
    err.code = "SMTP_NOT_CONFIGURED";
    throw err;
  }

  const from = smtp.from || `"${siteConfig.name}" <${smtp.user}>`;

  try {
    await transport.sendMail({
      from,
      to: email,
      subject,
      html,
      text: `Your ${siteConfig.name} verification code is ${code}. It expires in 15 minutes.`,
    });
    return { sent: true };
  } catch (err) {
    console.error("[VentureBank] Email send failed:", err.message);
    const message =
      err.code === "EAUTH"
        ? "Gmail authentication failed. Check SMTP_USER and SMTP_PASS (App Password) in .env.local."
        : `Failed to send email: ${err.message}`;
    const wrapped = new Error(message);
    wrapped.code = err.code || "SMTP_SEND_FAILED";
    throw wrapped;
  }
}
