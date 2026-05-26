export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
};

export const TRANSACTION_TYPES = {
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  TRANSFER: "transfer",
  PAYMENT: "payment",
};

export const TRANSACTION_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  REVERSED: "reversed",
};

export const ACCOUNT_TYPES = {
  CHECKING: "checking",
  SAVINGS: "savings",
  INVESTMENT: "investment",
};

export const NOTIFICATION_TYPES = {
  TRANSACTION: "transaction",
  DEPOSIT: "deposit",
  WITHDRAWAL: "withdrawal",
  TRANSFER: "transfer",
  CHAT: "chat",
  SECURITY: "security",
  ADMIN: "admin",
};

export const WITHDRAWAL_REQUEST_STATUS = {
  PENDING_SECURITY: "pending_security",
  PENDING_APPROVAL: "pending_approval",
  APPROVED: "approved",
  COMPLETED: "completed",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

export const DEPOSIT_METHODS = {
  WIRE: "wire",
  ACH: "ach",
  MOBILE: "mobile_check",
};
