import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireApiSession } from "@/lib/api-auth";
import Account from "@/models/Account";
import Transaction from "@/models/Transaction";
import {
  getUserTransactions,
  formatTransactionsForUI,
} from "@/lib/dashboard-service";
import {
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
} from "@/lib/constants";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { session, error, status } = await requireApiSession();
    if (error) return NextResponse.json({ error }, { status });

    await ensureDatabase();
    const limit = Number(request.nextUrl.searchParams.get("limit") || 50);
    const transactions = await getUserTransactions(session.id, limit);

    return NextResponse.json({
      transactions: formatTransactionsForUI(transactions),
    });
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Failed to load transactions" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { session, error, status } = await requireApiSession();
    if (error) return NextResponse.json({ error }, { status });

    const body = await request.json();
    const { fromAccountId, amount, description, recipientName, recipientAccount } = body;

    if (!fromAccountId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid transfer details" }, { status: 400 });
    }

    await ensureDatabase();

    const account = await Account.findOne({
      _id: fromAccountId,
      userId: session.id,
      isActive: true,
    });

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (account.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient funds. Make a deposit or contact support." },
        { status: 400 }
      );
    }

    account.balance -= amount;
    await account.save();

    const reference = `TXN-${Date.now().toString(36).toUpperCase()}`;
    const txn = await Transaction.create({
      userId: new mongoose.Types.ObjectId(session.id),
      accountId: account._id,
      type: TRANSACTION_TYPES.TRANSFER,
      amount: Number(amount),
      status: TRANSACTION_STATUS.COMPLETED,
      description: description || `Transfer to ${recipientName || "recipient"}`,
      recipientAccount: recipientAccount || undefined,
      reference,
      metadata: { category: "Transfer", recipientName },
    });

    return NextResponse.json({
      success: true,
      transaction: {
        id: txn._id.toString(),
        reference,
        amount: txn.amount,
        status: txn.status,
      },
      newBalance: account.balance,
    });
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Transfer failed" }, { status: 500 });
  }
}
