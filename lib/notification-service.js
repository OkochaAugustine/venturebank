import Notification from "@/models/Notification";
import User from "@/models/User";
import { NOTIFICATION_TYPES, USER_ROLES } from "@/lib/constants";
import { sendTransactionAlertEmail } from "@/lib/mail";

export const LARGE_TRANSACTION_THRESHOLD = 5000;

async function getAdminUsers() {
  return User.find({ role: USER_ROLES.ADMIN, isActive: true })
    .select("_id email firstName lastName")
    .lean();
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  priority = "normal",
  transactionId,
  withdrawalRequestId,
  messageId,
  metadata,
  sendEmail = false,
  email,
  emailData,
}) {
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    priority,
    transactionId,
    withdrawalRequestId,
    messageId,
    metadata,
  });

  if (sendEmail && email && emailData) {
    try {
      await sendTransactionAlertEmail({ email, ...emailData });
    } catch (err) {
      console.error("[VentureBank] Notification email failed:", err.message);
    }
  }

  return notification;
}

export async function notifyUser({
  userId,
  type,
  title,
  message,
  priority = "normal",
  transactionId,
  withdrawalRequestId,
  messageId,
  metadata,
  sendEmail = false,
  emailData,
}) {
  const user = await User.findById(userId).select("email firstName lastName").lean();
  return createNotification({
    userId,
    type,
    title,
    message,
    priority,
    transactionId,
    withdrawalRequestId,
    messageId,
    metadata,
    sendEmail: sendEmail && Boolean(user?.email),
    email: user?.email,
    emailData: user
      ? {
          firstName: user.firstName,
          email: user.email,
          ...emailData,
        }
      : emailData,
  });
}

export async function notifyAllAdmins({
  title,
  message,
  priority = "high",
  metadata,
  sendEmail = true,
}) {
  const admins = await getAdminUsers();
  const results = [];

  for (const admin of admins) {
    const n = await createNotification({
      userId: admin._id,
      type: NOTIFICATION_TYPES.ADMIN,
      title,
      message,
      priority,
      metadata,
      sendEmail,
      email: admin.email,
      emailData: {
        firstName: admin.firstName,
        title,
        message,
        txnType: "admin_alert",
        status: metadata?.status || "alert",
        reference: metadata?.reference,
        amount: metadata?.amount,
        timestamp: new Date().toISOString(),
        accountName: metadata?.accountName,
        accountNumber: metadata?.accountNumber,
      },
    });
    results.push(n);
  }
  return results;
}

export async function notifyTransaction({
  userId,
  userEmail,
  firstName,
  title,
  message,
  transactionId,
  txnType,
  amount,
  reference,
  status,
  accountName,
  accountNumber,
  timestamp,
}) {
  const ts = timestamp || new Date().toISOString();
  await notifyUser({
    userId,
    type:
      txnType === "deposit"
        ? NOTIFICATION_TYPES.DEPOSIT
        : txnType === "withdrawal"
          ? NOTIFICATION_TYPES.WITHDRAWAL
          : txnType === "transfer"
            ? NOTIFICATION_TYPES.TRANSFER
            : NOTIFICATION_TYPES.TRANSACTION,
    title,
    message,
    priority: status === "pending" ? "high" : "normal",
    transactionId,
    metadata: { txnType, amount, reference, status, accountName, accountNumber, timestamp: ts },
    sendEmail: true,
    emailData: {
      title,
      message,
      amount,
      reference,
      status,
      txnType,
      accountName,
      accountNumber,
      timestamp: ts,
    },
  });

  if (typeof amount === "number" && amount >= LARGE_TRANSACTION_THRESHOLD) {
    await notifyAllAdmins({
      title: `Large ${txnType || "transaction"}: $${amount.toFixed(2)}`,
      message: `${firstName || "Member"} — ${message}`,
      priority: "high",
      metadata: { txnType, amount, reference, status, userId: userId?.toString(), accountName, accountNumber },
    });
  }
}

export async function notifySecurityEvent(userId, { title, message, event }) {
  return notifyUser({
    userId,
    type: NOTIFICATION_TYPES.SECURITY,
    title,
    message,
    priority: "high",
    metadata: { event, timestamp: new Date().toISOString() },
    sendEmail: true,
    emailData: { title, message, txnType: "security", status: "completed" },
  });
}

export async function notifyProfileUpdate(userId, { fields }) {
  const fieldList = Array.isArray(fields) ? fields.join(", ") : fields;
  return notifyUser({
    userId,
    type: NOTIFICATION_TYPES.SECURITY,
    title: "Profile updated",
    message: `Your account profile was updated (${fieldList}). If this wasn't you, contact support immediately.`,
    priority: "normal",
    metadata: { event: "profile_update", fields, timestamp: new Date().toISOString() },
    sendEmail: true,
    emailData: {
      title: "Profile updated",
      message: `Changes: ${fieldList}`,
      txnType: "profile",
      status: "completed",
    },
  });
}

export async function notifyChatMessage({ userId, content, messageId, fromAdmin }) {
  await notifyUser({
    userId,
    type: NOTIFICATION_TYPES.CHAT,
    title: fromAdmin ? "New message from VentureBank Support" : "Message sent to support",
    message: content.length > 200 ? `${content.slice(0, 197)}...` : content,
    priority: fromAdmin ? "high" : "normal",
    messageId,
    metadata: { fromAdmin, timestamp: new Date().toISOString() },
    sendEmail: fromAdmin,
    emailData: fromAdmin
      ? {
          title: "New support message",
          message: content,
          txnType: "chat",
          status: "new",
        }
      : undefined,
  });
}

export async function notifyAdminNewRegistration(user, accountDetails = {}) {
  const memberName = `${user.firstName} ${user.lastName}`.trim();
  const { sendAdminNewMemberEmail } = await import("@/lib/mail");
  const admins = await getAdminUsers();

  await notifyAllAdmins({
    title: "New member registration",
    message: `${memberName} (${user.email}) opened an account. Account #${accountDetails.accountNumber || "pending"}.`,
    metadata: {
      event: "registration",
      userId: user._id?.toString(),
      email: user.email,
      accountNumber: accountDetails.accountNumber,
      accountName: accountDetails.accountName,
      phone: user.phone,
    },
    sendEmail: false,
  });

  for (const admin of admins) {
    try {
      await sendAdminNewMemberEmail({
        adminEmail: admin.email,
        adminFirstName: admin.firstName,
        memberName,
        memberEmail: user.email,
        phone: user.phone,
        accountNumber: accountDetails.accountNumber,
        accountType: accountDetails.accountName || "Primary Checking",
        registeredAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("[VentureBank] Admin new member email failed:", err.message);
    }
  }
}

export async function notifyAdminKycSubmitted(user, kycData) {
  await notifyAllAdmins({
    title: "KYC submission pending review",
    message: `${user.firstName} ${user.lastName} submitted identity documents for verification.`,
    metadata: {
      event: "kyc",
      userId: user._id?.toString(),
      fullName: kycData?.fullName,
    },
  });
}

export async function notifyAdminDepositRequest(user, { amount, reference, accountName }) {
  await notifyAllAdmins({
    title: "Deposit request pending",
    message: `${user.firstName} ${user.lastName} requested a deposit of $${amount.toFixed(2)}. Ref: ${reference}`,
    metadata: { event: "deposit_request", amount, reference, accountName, userId: user._id?.toString() },
  });
}

export async function notifyAdminWithdrawalRequest(user, { amount, reference }) {
  await notifyAllAdmins({
    title: "Withdrawal awaiting security code",
    message: `${user.firstName} ${user.lastName} requested withdrawal of $${amount.toFixed(2)}. Ref: ${reference}`,
    metadata: { event: "withdrawal_request", amount, reference, userId: user._id?.toString() },
  });
}

export async function getUserNotifications(userId, limit = 50) {
  return Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function getUnreadCount(userId) {
  return Notification.countDocuments({ userId, read: false });
}
