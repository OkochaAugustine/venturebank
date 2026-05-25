import { NextResponse } from "next/server";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireAdminSession } from "@/lib/api-auth";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { error, status } = await requireAdminSession();
    if (error) return NextResponse.json({ error }, { status });

    await ensureDatabase();

    const limit = Number(request.nextUrl.searchParams.get("limit") || 100);
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("userId", "firstName lastName email")
      .populate("accountId", "name accountNumber")
      .lean();

    return NextResponse.json({
      transactions: transactions.map((t) => ({
        id: t._id.toString(),
        type: t.type,
        amount: t.amount,
        status: t.status,
        description: t.description,
        reference: t.reference,
        createdAt: t.createdAt,
        user: t.userId
          ? {
              id: t.userId._id.toString(),
              name: `${t.userId.firstName} ${t.userId.lastName}`,
              email: t.userId.email,
            }
          : null,
        account: t.accountId?.name,
      })),
    });
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Failed to load transactions" }, { status: 500 });
  }
}
