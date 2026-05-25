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

export async function sendWelcomeAccountEmail({
  email,
  firstName,
  lastName,
  phone,
  accountNumber,
  accountType = "Primary Checking",
  status = "Active",
}) {
  const transport = createTransport();
  const smtp = getSmtpConfig();
  const name = `${firstName || ""} ${lastName || ""}`.trim() || "Member";

  if (!transport) {
    throw new Error("Email is not configured. Add SMTP credentials to .env.local");
  }

  const subject = `${siteConfig.name} — Your account is ready`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <div style="background:linear-gradient(135deg,#0369a1,#1e40af);border-radius:12px 12px 0 0;padding:28px;color:#fff;">
        <h1 style="margin:0;font-size:22px;">Welcome to ${siteConfig.name}</h1>
        <p style="margin:8px 0 0;opacity:0.9;font-size:14px;">Your online banking profile has been created</p>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:28px;">
        <p style="color:#334155;">Dear ${name},</p>
        <p style="color:#334155;">Thank you for joining ${siteConfig.name}. Below are your account details:</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
          <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Account holder</td><td style="padding:10px 0;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;">${name}</td></tr>
          <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Mobile</td><td style="padding:10px 0;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;">${phone || "—"}</td></tr>
          <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Account type</td><td style="padding:10px 0;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9;">${accountType}</td></tr>
          <tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #f1f5f9;">Account number</td><td style="padding:10px 0;font-family:monospace;font-weight:700;color:#0369a1;border-bottom:1px solid #f1f5f9;">${accountNumber}</td></tr>
          <tr><td style="padding:10px 0;color:#64748b;">Status</td><td style="padding:10px 0;font-weight:600;color:#059669;">${status}</td></tr>
        </table>
        <p style="color:#64748b;font-size:13px;">Next step: sign in and create your secure banking PIN before accessing your dashboard.</p>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px;">Never share your PIN or password. ${siteConfig.name} will never ask for them by email.</p>
      </div>
    </div>
  `;

  const from = smtp.from || `"${siteConfig.name}" <${smtp.user}>`;
  await transport.sendMail({
    from,
    to: email,
    subject,
    html,
    text: `Welcome ${name}. Account number: ${accountNumber}. Status: ${status}. Mobile: ${phone || "N/A"}. Create your PIN at login.`,
  });
  return { sent: true };
}
