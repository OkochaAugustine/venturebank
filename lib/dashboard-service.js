import Account from "@/models/Account";
import Transaction from "@/models/Transaction";
import { TRANSACTION_TYPES, TRANSACTION_STATUS } from "@/lib/constants";
import { ACCOUNT_LIMIT } from "@/config/dashboard";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function getUserAccounts(userId) {
  return Account.find({ userId, isActive: true }).sort({ createdAt: 1 }).lean();
}

export async function getUserTransactions(userId, limit = 50) {
  return Transaction.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("accountId", "name accountNumber accountType")
    .lean();
}

export function computeTotalBalance(accounts) {
  return accounts.reduce((sum, a) => sum + (a.balance || 0), 0);
}

export function buildBalanceHistory(transactions, accounts) {
  const total = computeTotalBalance(accounts);
  const now = new Date();
  const history = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
    const monthTxns = transactions.filter((t) => {
      const td = new Date(t.createdAt);
      return (
        td.getFullYear() === d.getFullYear() &&
        td.getMonth() === d.getMonth() &&
        t.status === TRANSACTION_STATUS.COMPLETED
      );
    });

    let income = 0;
    let outflow = 0;
    monthTxns.forEach((t) => {
      if (t.type === TRANSACTION_TYPES.DEPOSIT) income += t.amount;
      else outflow += t.amount;
    });

    history.push({
      month: MONTHS[d.getMonth()],
      balance: i === 0 ? total : Math.max(0, total - outflow + income),
      income,
      expenses: outflow,
    });
  }

  if (transactions.length === 0) {
    return MONTHS.map((month) => ({ month, balance: 0, income: 0, expenses: 0 }));
  }

  return history;
}

export function buildSpendingByCategory(transactions) {
  const categories = {};
  const colors = ["#0369a1", "#0ea5e9", "#38bdf8", "#7dd3fc", "#64748b", "#94a3b8"];

  transactions
    .filter(
      (t) =>
        t.status === TRANSACTION_STATUS.COMPLETED &&
        [TRANSACTION_TYPES.WITHDRAWAL, TRANSACTION_TYPES.PAYMENT, TRANSACTION_TYPES.TRANSFER].includes(
          t.type
        )
    )
    .forEach((t) => {
      const cat = t.metadata?.category || t.type;
      categories[cat] = (categories[cat] || 0) + t.amount;
    });

  const entries = Object.entries(categories).map(([category, amount], i) => ({
    category,
    amount,
    fill: colors[i % colors.length],
  }));

  return entries.length ? entries : [];
}

export function buildDashboardStats(accounts, transactions) {
  const total = computeTotalBalance(accounts);
  const completed = transactions.filter((t) => t.status === TRANSACTION_STATUS.COMPLETED);
  const deposits = completed.filter((t) => t.type === TRANSACTION_TYPES.DEPOSIT);
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const thisMonth = completed.filter((t) => new Date(t.createdAt) >= monthStart);
  const monthlySpend = thisMonth
    .filter((t) => t.type !== TRANSACTION_TYPES.DEPOSIT)
    .reduce((s, t) => s + t.amount, 0);

  const monthlyDeposits = thisMonth
    .filter((t) => t.type === TRANSACTION_TYPES.DEPOSIT)
    .reduce((s, t) => s + t.amount, 0);

  return {
    totalBalance: total,
    accountCount: accounts.length,
    transactionCount: transactions.length,
    monthlySpend,
    monthlyDeposits,
    monthlyExpenses: monthlySpend,
    totalVolume: completed.reduce((s, t) => s + t.amount, 0),
    accountLimit: ACCOUNT_LIMIT,
    totalDeposits: deposits.reduce((s, t) => s + t.amount, 0),
    pendingCount: transactions.filter((t) => t.status === TRANSACTION_STATUS.PENDING).length,
    pendingAmount: transactions
      .filter((t) => t.status === TRANSACTION_STATUS.PENDING)
      .reduce((s, t) => s + t.amount, 0),
  };
}

export function formatTransactionsForUI(transactions) {
  return transactions.map((t) => {
    const account = t.accountId;
    const isCredit = t.type === TRANSACTION_TYPES.DEPOSIT;
    return {
      id: t._id.toString(),
      description: t.description || t.type,
      reference: t.reference || `TXN-${t._id.toString().slice(-8).toUpperCase()}`,
      category: t.metadata?.category || t.type,
      account: account?.name || "Account",
      accountNumber: account?.accountNumber,
      date: t.createdAt,
      status: t.status,
      type: isCredit ? "credit" : "debit",
      amount: isCredit ? t.amount : -t.amount,
      rawType: t.type,
    };
  });
}
