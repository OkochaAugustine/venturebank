import { NextResponse } from "next/server";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireApiSession } from "@/lib/api-auth";
import { getUserAccounts, computeTotalBalance } from "@/lib/dashboard-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { session, error, status } = await requireApiSession();
    if (error) return NextResponse.json({ error }, { status });

    await ensureDatabase();
    const accounts = await getUserAccounts(session.id);

    return NextResponse.json({
      accounts: accounts.map((a) => ({
        id: a._id.toString(),
        name: a.name,
        accountType: a.accountType,
        accountNumber: a.accountNumber,
        balance: a.balance,
        currency: a.currency || "USD",
      })),
      totalBalance: computeTotalBalance(accounts),
    });
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Failed to load accounts" }, { status: 500 });
  }
}
