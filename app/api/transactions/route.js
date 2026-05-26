import { NextResponse } from "next/server";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireApiSession } from "@/lib/api-auth";
import {
  getUserTransactions,
  formatTransactionsForUI,
} from "@/lib/dashboard-service";
import { jsonError } from "@/lib/api-utils";

export const runtime = "nodejs";

/** List transactions — use POST /api/banking/transfer for transfers */
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

export async function POST() {
  return jsonError(
    "Use POST /api/banking/transfer with PIN and security verification",
    400
  );
}
