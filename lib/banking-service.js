import mongoose from "mongoose";
import Account from "@/models/Account";
import Transaction from "@/models/Transaction";
import WithdrawalRequest from "@/models/WithdrawalRequest";
import User from "@/models/User";
import {
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  WITHDRAWAL_REQUEST_STATUS,
} from "@/lib/constants";
import { generateReference } from "@/lib/banking-security";
import {
  notifyTransaction,
  notifyAdminDepositRequest,
  notifyAdminWithdrawalRequest,
} from "@/lib/notification-service";

async function getUserEmailData(userId) {
  const user = await User.findById(userId).select("email firstName lastName").lean();
  return user;
}

export async function executeTransfer(userId, { accountId, amount, description, recipientName, recipientAccount }) {
  const account = await Account.findOne({ _id: accountId, userId, isActive: true });
  if (!account) throw Object.assign(new Error("Account not found"), { status: 404 });
  if (account.balance < amount) {
    throw Object.assign(new Error("Insufficient funds"), { status: 400 });
  }

  account.balance -= amount;
  await account.save();

  const reference = generateReference("TRF");
  const txn = await Transaction.create({
    userId: new mongoose.Types.ObjectId(userId),
    accountId: account._id,
    type: TRANSACTION_TYPES.TRANSFER,
    amount: Number(amount),
    status: TRANSACTION_STATUS.COMPLETED,
    description: description || `Transfer to ${recipientName || "recipient"}`,
    recipientAccount: recipientAccount || undefined,
    reference,
    metadata: { category: "Transfer", recipientName, recipientAccount },
  });

  const user = await getUserEmailData(userId);
  const ts = new Date().toISOString();
  await notifyTransaction({
    userId,
    userEmail: user?.email,
    firstName: user?.firstName,
    title: "Transfer completed",
    message: `${description || "Transfer"} of $${amount.toFixed(2)} was sent to ${recipientName || "recipient"}. Ref: ${reference}`,
    transactionId: txn._id,
    txnType: "transfer",
    amount,
    reference,
    status: "completed",
    accountName: account.name,
    accountNumber: account.accountNumber,
    timestamp: ts,
  });

  return { transaction: txn, account, reference };
}

export async function createInstantDeposit(userId, { accountId, amount, method, description }) {
  const account = await Account.findOne({ _id: accountId, userId, isActive: true });
  if (!account) throw Object.assign(new Error("Account not found"), { status: 404 });

  // Immediately credit the account balance (real-time, no pending approval)
  account.balance += Number(amount);
  await account.save();

  const reference = generateReference("DEP");
  const txn = await Transaction.create({
    userId: new mongoose.Types.ObjectId(userId),
    accountId: account._id,
    type: TRANSACTION_TYPES.DEPOSIT,
    amount: Number(amount),
    status: TRANSACTION_STATUS.COMPLETED,
    description: description || `Deposit (${method || "wire"})`,
    reference,
    metadata: { category: "Deposit", method },
  });

  const user = await User.findById(userId).select("email firstName lastName");
  const ts = new Date().toISOString();
  await notifyTransaction({
    userId,
    userEmail: user?.email,
    firstName: user?.firstName,
    title: "Deposit completed",
    message: `Your deposit of $${amount.toFixed(2)} has been credited instantly. Ref: ${reference}`,
    transactionId: txn._id,
    txnType: "deposit",
    amount,
    reference,
    status: "completed",
    accountName: account.name,
    accountNumber: account.accountNumber,
    timestamp: ts,
  });

  return { transaction: txn, account, reference };
}

export async function createPaystackDepositIntent(userId, { accountId, amount, method, description }) {
  const account = await Account.findOne({ _id: accountId, userId, isActive: true });
  if (!account) throw Object.assign(new Error("Account not found"), { status: 404 });

  const reference = generateReference("PAY");
  const txn = await Transaction.create({
    userId: new mongoose.Types.ObjectId(userId),
    accountId: account._id,
    type: TRANSACTION_TYPES.DEPOSIT,
    amount: Number(amount),
    status: TRANSACTION_STATUS.PENDING,
    description: description || `Paystack deposit (${method || "online"})`,
    reference,
    metadata: {
      category: "Deposit",
      method,
      paymentProvider: "paystack",
      initializedAt: new Date().toISOString(),
    },
  });

  return { transaction: txn, account, reference };
}

export async function completePaystackDeposit({ reference, amountKobo, currency, gatewayResponse }) {
  const txn = await Transaction.findOne({ reference, type: TRANSACTION_TYPES.DEPOSIT });
  if (!txn) {
    throw Object.assign(new Error("Deposit transaction not found"), { status: 404 });
  }

  if (txn.status === TRANSACTION_STATUS.COMPLETED) {
    return { transaction: txn };
  }

  if (txn.status !== TRANSACTION_STATUS.PENDING) {
    throw Object.assign(new Error("Deposit transaction cannot be completed"), { status: 400 });
  }

  const amount = Number(amountKobo) / 100;
  if (Number(txn.amount) !== amount) {
    txn.status = TRANSACTION_STATUS.FAILED;
    txn.metadata = {
      ...txn.metadata,
      paymentProvider: "paystack",
      verifiedAt: new Date().toISOString(),
      verificationError: "Amount mismatch",
      gatewayResponse,
    };
    await txn.save();
    throw Object.assign(new Error("Payment amount does not match deposit request"), { status: 400 });
  }

  const account = await Account.findById(txn.accountId);
  if (!account) throw Object.assign(new Error("Account not found"), { status: 404 });

  account.balance += txn.amount;
  await account.save();

  txn.status = TRANSACTION_STATUS.COMPLETED;
  txn.metadata = {
    ...txn.metadata,
    paymentProvider: "paystack",
    verifiedAt: new Date().toISOString(),
    gatewayResponse,
  };
  await txn.save();

  const user = await User.findById(txn.userId).select("email firstName lastName");
  const ts = new Date().toISOString();
  await notifyTransaction({
    userId: txn.userId,
    userEmail: user?.email,
    firstName: user?.firstName,
    title: "Deposit completed",
    message: `Your deposit of $${txn.amount.toFixed(2)} has been credited. Ref: ${txn.reference}`,
    transactionId: txn._id,
    txnType: "deposit",
    amount: txn.amount,
    reference: txn.reference,
    status: "completed",
    accountName: account.name,
    accountNumber: account.accountNumber,
    timestamp: ts,
  });

  return { transaction: txn, account };
}

export async function createDepositRequest(userId, { accountId, amount, method, description }) {
  const account = await Account.findOne({ _id: accountId, userId, isActive: true });
  if (!account) throw Object.assign(new Error("Account not found"), { status: 404 });

  const reference = generateReference("DEP");
  const txn = await Transaction.create({
    userId: new mongoose.Types.ObjectId(userId),
    accountId: account._id,
    type: TRANSACTION_TYPES.DEPOSIT,
    amount: Number(amount),
    status: TRANSACTION_STATUS.PENDING,
    description: description || `Deposit request (${method || "wire"})`,
    reference,
    metadata: { category: "Deposit", method, depositRequest: true },
  });

  const user = await User.findById(userId).select("email firstName lastName");
  const ts = new Date().toISOString();
  await notifyTransaction({
    userId,
    userEmail: user?.email,
    firstName: user?.firstName,
    title: "Deposit request submitted",
    message: `Your deposit of $${amount.toFixed(2)} is pending review. Ref: ${reference}. Funds will credit after VentureBank confirms receipt.`,
    transactionId: txn._id,
    txnType: "deposit",
    amount,
    reference,
    status: "pending",
    accountName: account.name,
    accountNumber: account.accountNumber,
    timestamp: ts,
  });

  if (user) {
    await notifyAdminDepositRequest(user, {
      amount: Number(amount),
      reference,
      accountName: account.name,
    });
  }

  return { transaction: txn, reference };
}

export async function approveDeposit(transactionId, adminId) {
  const txn = await Transaction.findById(transactionId);
  if (!txn || txn.type !== TRANSACTION_TYPES.DEPOSIT) {
    throw Object.assign(new Error("Deposit transaction not found"), { status: 404 });
  }
  if (txn.status !== TRANSACTION_STATUS.PENDING) {
    throw Object.assign(new Error("Deposit is not pending"), { status: 400 });
  }

  const account = await Account.findById(txn.accountId);
  if (!account) throw Object.assign(new Error("Account not found"), { status: 404 });

  account.balance += txn.amount;
  await account.save();

  txn.status = TRANSACTION_STATUS.COMPLETED;
  txn.metadata = { ...txn.metadata, approvedBy: adminId, approvedAt: new Date().toISOString() };
  await txn.save();

  const user = await getUserEmailData(txn.userId);
  await notifyTransaction({
    userId: txn.userId,
    userEmail: user?.email,
    firstName: user?.firstName,
    title: "Deposit credited — funds received",
    message: `$${txn.amount.toFixed(2)} has been credited to your ${account.name} account. Ref: ${txn.reference}`,
    transactionId: txn._id,
    txnType: "deposit",
    amount: txn.amount,
    reference: txn.reference,
    status: "completed",
    accountName: account.name,
    accountNumber: account.accountNumber,
    timestamp: new Date().toISOString(),
  });

  return { transaction: txn, account };
}

export async function createWithdrawalRequest(userId, { accountId, amount, description }) {
  const account = await Account.findOne({ _id: accountId, userId, isActive: true });
  if (!account) throw Object.assign(new Error("Account not found"), { status: 404 });

  const reference = generateReference("WDR");
  const request = await WithdrawalRequest.create({
    userId: new mongoose.Types.ObjectId(userId),
    accountId: account._id,
    amount: Number(amount),
    status: WITHDRAWAL_REQUEST_STATUS.PENDING_SECURITY,
    description: description || "Withdrawal request",
    reference,
    metadata: { pinVerified: true, requestedAt: new Date().toISOString() },
  });

  const user = await User.findById(userId).select("email firstName lastName");
  const ts = new Date().toISOString();
  await notifyTransaction({
    userId,
    userEmail: user?.email,
    firstName: user?.firstName,
    title: "Withdrawal request received",
    message: `Your withdrawal of $${amount.toFixed(2)} (Ref: ${reference}) requires VentureBank security code approval. Contact 1-800-VENTURE or live chat.`,
    txnType: "withdrawal",
    amount: Number(amount),
    reference,
    status: "pending_security",
    accountName: account.name,
    accountNumber: account.accountNumber,
    timestamp: ts,
  });

  if (user) {
    await notifyAdminWithdrawalRequest(user, { amount: Number(amount), reference });
  }

  return { request, reference };
}

export async function adminAdjustBalance(userId, { accountId, amount, type, description, adminId, action = "credit" }) {
  const account = await Account.findOne({ _id: accountId, userId });
  if (!account) throw Object.assign(new Error("Account not found"), { status: 404 });

  const numAmount = Number(amount);
  let txnType = type;
  let balanceChange = 0;

  if (action === "credit" || type === TRANSACTION_TYPES.DEPOSIT) {
    account.balance += numAmount;
    balanceChange = numAmount;
    txnType = TRANSACTION_TYPES.DEPOSIT;
  } else if (action === "debit" || type === TRANSACTION_TYPES.WITHDRAWAL) {
    if (account.balance < numAmount) {
      throw Object.assign(new Error("Insufficient balance"), { status: 400 });
    }
    account.balance -= numAmount;
    balanceChange = -numAmount;
    txnType = TRANSACTION_TYPES.WITHDRAWAL;
  } else {
    throw Object.assign(new Error("Invalid admin action"), { status: 400 });
  }

  await account.save();

  const reference = generateReference("ADM");
  const txn = await Transaction.create({
    userId: new mongoose.Types.ObjectId(userId),
    accountId: account._id,
    type: txnType,
    amount: numAmount,
    status: TRANSACTION_STATUS.COMPLETED,
    description: description || `Admin ${action}`,
    reference,
    metadata: { category: "Admin", adminAction: action, adminId: adminId?.toString() },
  });

  const user = await getUserEmailData(userId);
  const actionLabel = action === "credit" ? "credited to" : "debited from";
  await notifyTransaction({
    userId,
    userEmail: user?.email,
    firstName: user?.firstName,
    title: `Account ${action === "credit" ? "credited" : "debited"}`,
    message: `$${numAmount.toFixed(2)} was ${actionLabel} your ${account.name} account by VentureBank. Ref: ${reference}`,
    transactionId: txn._id,
    txnType: txnType,
    amount: numAmount,
    reference,
    status: "completed",
    accountName: account.name,
    accountNumber: account.accountNumber,
    timestamp: new Date().toISOString(),
  });

  return { transaction: txn, account, reference };
}

export async function reverseTransaction(transactionId, adminId, reason) {
  const txn = await Transaction.findById(transactionId);
  if (!txn) throw Object.assign(new Error("Transaction not found"), { status: 404 });
  if (txn.status === TRANSACTION_STATUS.REVERSED) {
    throw Object.assign(new Error("Already reversed"), { status: 400 });
  }
  if (txn.status !== TRANSACTION_STATUS.COMPLETED) {
    throw Object.assign(new Error("Only completed transactions can be reversed"), { status: 400 });
  }

  const account = await Account.findById(txn.accountId);
  if (!account) throw Object.assign(new Error("Account not found"), { status: 404 });

  if (txn.type === TRANSACTION_TYPES.DEPOSIT || txn.type === TRANSACTION_TYPES.TRANSFER) {
    if (txn.type === TRANSACTION_TYPES.DEPOSIT) {
      if (account.balance < txn.amount) {
        throw Object.assign(new Error("Insufficient balance to reverse deposit"), { status: 400 });
      }
      account.balance -= txn.amount;
    } else {
      account.balance += txn.amount;
    }
  } else if (txn.type === TRANSACTION_TYPES.WITHDRAWAL) {
    account.balance += txn.amount;
  }

  await account.save();

  txn.status = TRANSACTION_STATUS.REVERSED;
  txn.metadata = { ...txn.metadata, reversedAt: new Date().toISOString(), reversedByAdmin: adminId, reason };
  await txn.save();

  const reversalRef = generateReference("REV");
  const reversalTxn = await Transaction.create({
    userId: txn.userId,
    accountId: txn.accountId,
    type: txn.type,
    amount: txn.amount,
    status: TRANSACTION_STATUS.COMPLETED,
    description: `Reversal: ${txn.description || txn.type}`,
    reference: reversalRef,
    reversalOf: txn._id,
    metadata: { category: "Reversal", originalReference: txn.reference, reason },
  });

  txn.reversedBy = reversalTxn._id;
  await txn.save();

  const user = await getUserEmailData(txn.userId);
  await notifyTransaction({
    userId: txn.userId,
    userEmail: user?.email,
    firstName: user?.firstName,
    title: "Transaction reversed",
    message: `Transaction ${txn.reference} was reversed on your ${account.name} account. ${reason || ""} New ref: ${reversalRef}`,
    transactionId: reversalTxn._id,
    txnType: "reversal",
    amount: txn.amount,
    reference: reversalRef,
    status: "reversed",
    accountName: account.name,
    accountNumber: account.accountNumber,
    timestamp: new Date().toISOString(),
  });

  return { original: txn, reversal: reversalTxn, account };
}

export async function approveWithdrawal(requestId, adminId, securityCode) {
  const request = await WithdrawalRequest.findById(requestId);
  if (!request) throw Object.assign(new Error("Withdrawal request not found"), { status: 404 });

  const account = await Account.findById(request.accountId);
  if (!account) throw Object.assign(new Error("Account not found"), { status: 404 });
  if (account.balance < request.amount) {
    throw Object.assign(new Error("Insufficient balance"), { status: 400 });
  }

  account.balance -= request.amount;
  await account.save();

  const reference = request.reference || generateReference("WDR");
  const txn = await Transaction.create({
    userId: request.userId,
    accountId: account._id,
    type: TRANSACTION_TYPES.WITHDRAWAL,
    amount: request.amount,
    status: TRANSACTION_STATUS.COMPLETED,
    description: request.description || "Approved withdrawal",
    reference,
    metadata: { withdrawalRequestId: request._id.toString(), securityCodeUsed: Boolean(securityCode) },
  });

  request.status = WITHDRAWAL_REQUEST_STATUS.COMPLETED;
  request.securityCodeApproved = true;
  request.securityCodeApprovedAt = new Date();
  request.securityCodeApprovedBy = adminId;
  request.transactionId = txn._id;
  await request.save();

  const user = await getUserEmailData(request.userId);
  await notifyTransaction({
    userId: request.userId,
    userEmail: user?.email,
    firstName: user?.firstName,
    title: "Withdrawal completed",
    message: `$${request.amount.toFixed(2)} has been withdrawn from your ${account.name} account. Ref: ${reference}`,
    transactionId: txn._id,
    txnType: "withdrawal",
    amount: request.amount,
    reference,
    status: "completed",
    accountName: account.name,
    accountNumber: account.accountNumber,
    timestamp: new Date().toISOString(),
  });

  return { request, transaction: txn, account };
}
