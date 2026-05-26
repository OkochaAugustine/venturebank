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

export async function sendAdminNewMemberEmail({
  adminEmail,
  adminFirstName,
  memberName,
  memberEmail,
  phone,
  accountNumber,
  accountType = "Primary Checking",
  registeredAt,
}) {
  const transport = createTransport();
  const smtp = getSmtpConfig();

  if (!transport) {
    throw new Error("Email is not configured. Add SMTP credentials to .env.local");
  }

  const subject = `${siteConfig.name} — New member account opened`;
  const when = registeredAt || new Date().toISOString();
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <h2 style="color:#0f172a;margin:0 0 12px;">New member registration</h2>
      <p style="color:#334155;">Hello ${adminFirstName || "Admin"}, a new account was created on ${siteConfig.name}.</p>
      <table style="width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;">
        <tr><td style="padding:8px 0;color:#64748b;">Member</td><td style="padding:8px 0;font-weight:600;">${memberName}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="padding:8px 0;">${memberEmail}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Mobile</td><td style="padding:8px 0;">${phone || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Account type</td><td style="padding:8px 0;">${accountType}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Account number</td><td style="padding:8px 0;font-family:monospace;font-weight:700;color:#0369a1;">${accountNumber || "—"}</td></tr>
        <tr><td style="padding:8px 0;color:#64748b;">Registered</td><td style="padding:8px 0;">${when}</td></tr>
      </table>
      <p style="color:#64748b;font-size:13px;">Review KYC and activity in the admin dashboard.</p>
    </div>
  `;

  const from = smtp.from || `"${siteConfig.name}" <${smtp.user}>`;
  await transport.sendMail({
    from,
    to: adminEmail,
    subject,
    html,
    text: `New member ${memberName} (${memberEmail}). Account: ${accountNumber}.`,
  });
  return { sent: true };
}

export async function sendTransactionAlertEmail({
  email,
  firstName,
  title,
  message,
  amount,
  reference,
  status,
  txnType,
  accountName,
  accountNumber,
  timestamp,
}) {
  const transport = createTransport();
  const smtp = getSmtpConfig();
  const name = firstName || "Member";

  if (!transport) {
    console.warn("[VentureBank] SMTP not configured — skipping transaction email");
    return { sent: false };
  }

  const amountStr = typeof amount === "number" ? `$${amount.toFixed(2)}` : "";
  const when = timestamp
    ? new Date(timestamp).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
    : new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  const subject = `${siteConfig.name} — ${title}`;
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
      <div style="background:linear-gradient(135deg,#0369a1,#1e40af);border-radius:12px 12px 0 0;padding:24px;color:#fff;">
        <h1 style="margin:0;font-size:20px;">${title}</h1>
        <p style="margin:8px 0 0;opacity:0.9;font-size:13px;">${siteConfig.name} · ${txnType || "banking"} alert</p>
      </div>
      <div style="background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:24px;">
        <p style="color:#334155;">Dear ${name},</p>
        <p style="color:#334155;line-height:1.6;">${message}</p>
        ${amountStr ? `<p style="font-size:26px;font-weight:700;color:#0369a1;margin:20px 0;">${amountStr}</p>` : ""}
        <table style="width:100%;font-size:14px;margin-top:16px;border-collapse:collapse;">
          <tr><td style="color:#64748b;padding:8px 0;border-bottom:1px solid #f1f5f9;">Date & time</td><td style="font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${when}</td></tr>
          ${accountName ? `<tr><td style="color:#64748b;padding:8px 0;border-bottom:1px solid #f1f5f9;">Account</td><td style="font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${accountName}</td></tr>` : ""}
          ${accountNumber ? `<tr><td style="color:#64748b;padding:8px 0;border-bottom:1px solid #f1f5f9;">Account no.</td><td style="font-family:monospace;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${accountNumber}</td></tr>` : ""}
          <tr><td style="color:#64748b;padding:8px 0;border-bottom:1px solid #f1f5f9;">Reference</td><td style="font-family:monospace;font-weight:600;text-align:right;border-bottom:1px solid #f1f5f9;">${reference || "—"}</td></tr>
          <tr><td style="color:#64748b;padding:8px 0;">Status</td><td style="font-weight:600;text-transform:capitalize;text-align:right;color:#059669;">${status || "—"}</td></tr>
        </table>
        <p style="color:#94a3b8;font-size:12px;margin-top:24px;">If you did not authorize this activity, contact VentureBank immediately at 1-800-VENTURE or sign in to freeze your account via live chat.</p>
      </div>
    </div>
  `;

  const from = smtp.from || `"${siteConfig.name}" <${smtp.user}>`;
  await transport.sendMail({
    from,
    to: email,
    subject,
    html,
    text: `${title}. ${message} Amount: ${amountStr || "N/A"}. Ref: ${reference}. Status: ${status}. Time: ${when}.`,
  });
  return { sent: true };
}
