import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireAdminSession } from "@/lib/api-auth";
import User from "@/models/User";
import Account from "@/models/Account";
import Transaction from "@/models/Transaction";
import { formatTransactionsForUI, getUserTransactions } from "@/lib/dashboard-service";
import {
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
} from "@/lib/constants";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    const { error, status } = await requireAdminSession();
    if (error) return NextResponse.json({ error }, { status });

    const { id } = await params;
    await ensureDatabase();

    const user = await User.findById(id)
      .select("firstName lastName email phone isActive emailVerified createdAt")
      .lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const accounts = await Account.find({ userId: id }).lean();
    const transactions = await getUserTransactions(id, 100);

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      accounts: accounts.map((a) => ({
        id: a._id.toString(),
        name: a.name,
        accountType: a.accountType,
        accountNumber: a.accountNumber,
        balance: a.balance,
      })),
      transactions: formatTransactionsForUI(transactions),
    });
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Failed to load user" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { error, status } = await requireAdminSession();
    if (error) return NextResponse.json({ error }, { status });

    const { id } = await params;
    const body = await request.json();
    await ensureDatabase();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (typeof body.isActive === "boolean") {
      user.isActive = body.isActive;
      await user.save();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Update failed" }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { error, status } = await requireAdminSession();
    if (error) return NextResponse.json({ error }, { status });

    const { id } = await params;
    const body = await request.json();
    const { accountId, amount, description, type = TRANSACTION_TYPES.DEPOSIT } = body;

    if (!accountId || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid deposit data" }, { status: 400 });
    }

    await ensureDatabase();

    const account = await Account.findOne({ _id: accountId, userId: id });
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (type === TRANSACTION_TYPES.DEPOSIT) {
      account.balance += Number(amount);
    } else if (type === TRANSACTION_TYPES.WITHDRAWAL) {
      if (account.balance < amount) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
      }
      account.balance -= Number(amount);
    }

    await account.save();

    const reference = `ADM-${Date.now().toString(36).toUpperCase()}`;
    const txn = await Transaction.create({
      userId: new mongoose.Types.ObjectId(id),
      accountId: account._id,
      type,
      amount: Number(amount),
      status: TRANSACTION_STATUS.COMPLETED,
      description: description || (type === TRANSACTION_TYPES.DEPOSIT ? "Admin deposit" : "Admin withdrawal"),
      reference,
      metadata: { category: "Admin", adminAction: true },
    });

    return NextResponse.json({
      success: true,
      account: {
        id: account._id.toString(),
        balance: account.balance,
      },
      transaction: {
        id: txn._id.toString(),
        reference: txn.reference,
        amount: txn.amount,
        type: txn.type,
      },
    });
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Transaction failed" }, { status: 500 });
  }
}
