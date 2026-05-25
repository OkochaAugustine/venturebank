import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { StatsRow } from "@/components/dashboard/StatsRow";

export const metadata = {
  title: "Transactions",
};

export default function TransactionsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ocean-950">Transaction history</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search, filter, and review activity across all linked accounts.
        </p>
      </div>
      <StatsRow />
      <TransactionTable />
    </div>
  );
}
