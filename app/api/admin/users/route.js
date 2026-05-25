import { NextResponse } from "next/server";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireAdminSession } from "@/lib/api-auth";
import User from "@/models/User";
import Account from "@/models/Account";
import Transaction from "@/models/Transaction";
import { USER_ROLES } from "@/lib/constants";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { error, status } = await requireAdminSession();
    if (error) return NextResponse.json({ error }, { status });

    await ensureDatabase();

    const users = await User.find({ role: USER_ROLES.USER })
      .select("firstName lastName email phone isActive emailVerified createdAt lastLogin")
      .sort({ createdAt: -1 })
      .lean();

    const userIds = users.map((u) => u._id);
    const [accounts, txnCounts] = await Promise.all([
      Account.find({ userId: { $in: userIds } }).lean(),
      Transaction.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: "$userId", count: { $sum: 1 }, totalDeposits: {
          $sum: { $cond: [{ $eq: ["$type", "deposit"] }, "$amount", 0] }
        } } },
      ]),
    ]);

    const accountsByUser = {};
    accounts.forEach((a) => {
      const uid = a.userId.toString();
      if (!accountsByUser[uid]) accountsByUser[uid] = [];
      accountsByUser[uid].push(a);
    });

    const txnByUser = Object.fromEntries(
      txnCounts.map((t) => [t._id.toString(), t])
    );

    return NextResponse.json({
      users: users.map((u) => {
        const uid = u._id.toString();
        const userAccounts = accountsByUser[uid] || [];
        const balance = userAccounts.reduce((s, a) => s + a.balance, 0);
        const txn = txnByUser[uid];
        return {
          id: uid,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phone: u.phone,
          isActive: u.isActive,
          emailVerified: u.emailVerified,
          createdAt: u.createdAt,
          lastLogin: u.lastLogin,
          balance,
          accountCount: userAccounts.length,
          transactionCount: txn?.count || 0,
          totalDeposits: txn?.totalDeposits || 0,
        };
      }),
    });
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Failed to load users" }, { status: 500 });
  }
}
