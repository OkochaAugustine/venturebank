import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireApiSession } from "@/lib/api-auth";
import { jsonError } from "@/lib/api-utils";
import {
  getUserAccounts,
  getUserTransactions,
  computeTotalBalance,
  buildBalanceHistory,
  buildSpendingByCategory,
  buildDashboardStats,
  formatTransactionsForUI,
} from "@/lib/dashboard-service";
import { ACCOUNT_LIMIT } from "@/config/dashboard";

export const runtime = "nodejs";

const emptyPayload = (error) => ({
  error,
  accounts: [],
  transactions: [],
  totalBalance: 0,
  stats: {
    totalBalance: 0,
    accountCount: 0,
    transactionCount: 0,
    monthlySpend: 0,
    monthlyDeposits: 0,
    monthlyExpenses: 0,
    totalVolume: 0,
    accountLimit: ACCOUNT_LIMIT,
    totalDeposits: 0,
    pendingCount: 0,
    pendingAmount: 0,
  },
  balanceHistory: [],
  spendingByCategory: [],
  hasActivity: false,
});

export async function GET() {
  try {
    const { session, error, status } = await requireApiSession();
    if (error) return jsonError(error, status);

    await ensureDatabase();

    const [accounts, transactions] = await Promise.all([
      getUserAccounts(session.id),
      getUserTransactions(session.id, 100),
    ]);

    const totalBalance = computeTotalBalance(accounts);
    const stats = buildDashboardStats(accounts, transactions);
    const balanceHistory = buildBalanceHistory(transactions, accounts);
    const spendingByCategory = buildSpendingByCategory(transactions);
    const formattedTxns = formatTransactionsForUI(transactions);

    return Response.json({
      accounts: accounts.map((a) => ({
        id: a._id.toString(),
        name: a.name,
        accountType: a.accountType,
        accountNumber: a.accountNumber,
        balance: a.balance,
        currency: a.currency || "USD",
      })),
      transactions: formattedTxns,
      totalBalance,
      stats,
      balanceHistory,
      spendingByCategory,
      hasActivity: transactions.length > 0 || totalBalance > 0,
    });
  } catch (err) {
    console.error("[dashboard]", err?.message || err);
    const msg = formatDbError(err) || "Failed to load dashboard";
    const httpStatus =
      err.code === "DB_CONN_REFUSED" || err.code === "ENV_MISSING" ? 503 : 500;
    return Response.json(emptyPayload(msg), { status: httpStatus });
  }
}
