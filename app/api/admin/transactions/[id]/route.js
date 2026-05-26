import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireAdminSession } from "@/lib/api-auth";
import {
  reverseTransaction,
  approveDeposit,
} from "@/lib/banking-service";
import Transaction from "@/models/Transaction";
import { TRANSACTION_STATUS } from "@/lib/constants";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function PATCH(request, { params }) {
  try {
    const { session, error, status } = await requireAdminSession();
    if (error) return jsonError(error, status);

    const { id } = await params;
    const body = await request.json();
    await ensureDatabase();

    if (body.action === "approve_deposit") {
      const result = await approveDeposit(id, session.id);
      return jsonOk({
        success: true,
        transaction: {
          id: result.transaction._id.toString(),
          status: result.transaction.status,
        },
        newBalance: result.account.balance,
      });
    }

    if (body.action === "cancel") {
      const txn = await Transaction.findById(id);
      if (!txn) return jsonError("Transaction not found", 404);
      if (txn.status !== TRANSACTION_STATUS.PENDING) {
        return jsonError("Only pending transactions can be cancelled", 400);
      }
      txn.status = TRANSACTION_STATUS.CANCELLED;
      await txn.save();
      return jsonOk({ success: true, status: txn.status });
    }

    return jsonError("Unknown action", 400);
  } catch (err) {
    return jsonError(err.message || formatDbError(err) || "Update failed", err.status || 500);
  }
}

export async function POST(request, { params }) {
  try {
    const { session, error, status } = await requireAdminSession();
    if (error) return jsonError(error, status);

    const { id } = await params;
    const body = await request.json();
    await ensureDatabase();

    if (body.action === "reverse") {
      const result = await reverseTransaction(id, session.id, body.reason);
      return jsonOk({
        success: true,
        reversalReference: result.reversal.reference,
        newBalance: result.account.balance,
      });
    }

    return jsonError("Unknown action", 400);
  } catch (err) {
    return jsonError(err.message || formatDbError(err) || "Action failed", err.status || 500);
  }
}
