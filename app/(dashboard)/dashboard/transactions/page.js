import { TransactionTable } from "@/components/dashboard/TransactionTable";
import { StatsRow } from "@/components/dashboard/StatsRow";

export const metadata = {
  title: "Transactions",
};

export default function TransactionsPage() {
  return (
    <div className="dashboard-page space-y-6">
      <div className="surface-card p-5 sm:p-6">
        <h1 className="text-2xl font-bold text-foreground">Transaction history</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Full ledger with status, references, and real-time sync to your alert center.
        </p>
      </div>
      <StatsRow />
      <TransactionTable />
    </div>
  );
}
