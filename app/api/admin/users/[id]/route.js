import { NextResponse } from "next/server";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireAdminSession } from "@/lib/api-auth";
import User from "@/models/User";
import Account from "@/models/Account";
import { formatTransactionsForUI, getUserTransactions } from "@/lib/dashboard-service";
import { adminAdjustBalance } from "@/lib/banking-service";
import { TRANSACTION_TYPES } from "@/lib/constants";
import { jsonError, jsonOk } from "@/lib/api-utils";

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
    if (error) return jsonError(error, status);

    const { id } = await params;
    const body = await request.json();
    await ensureDatabase();

    const user = await User.findById(id);
    if (!user) return jsonError("User not found", 404);

    if (typeof body.isActive === "boolean") {
      user.isActive = body.isActive;
      await user.save();
    }

    return jsonOk({ success: true });
  } catch (err) {
    return jsonError(formatDbError(err) || "Update failed", 500);
  }
}

export async function POST(request, { params }) {
  try {
    const { session, error, status } = await requireAdminSession();
    if (error) return jsonError(error, status);

    const { id } = await params;
    const body = await request.json();
    const { accountId, amount, description, type, action } = body;

    if (!accountId || !amount || amount <= 0) {
      return jsonError("Invalid transaction data", 400);
    }

    await ensureDatabase();

    const credit = action === "credit" || type === TRANSACTION_TYPES.DEPOSIT;
    const debit = action === "debit" || type === TRANSACTION_TYPES.WITHDRAWAL;

    if (!credit && !debit) {
      return jsonError("Specify action: credit or debit", 400);
    }

    const result = await adminAdjustBalance(id, {
      accountId,
      amount: Number(amount),
      type: credit ? TRANSACTION_TYPES.DEPOSIT : TRANSACTION_TYPES.WITHDRAWAL,
      description,
      adminId: session.id,
      action: credit ? "credit" : "debit",
    });

    return jsonOk({
      success: true,
      account: {
        id: result.account._id.toString(),
        balance: result.account.balance,
      },
      transaction: {
        id: result.transaction._id.toString(),
        reference: result.reference,
        amount: result.transaction.amount,
        type: result.transaction.type,
      },
    });
  } catch (err) {
    return jsonError(err.message || formatDbError(err) || "Transaction failed", err.status || 500);
  }
}
