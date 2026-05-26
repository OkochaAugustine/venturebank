import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireBankingSession } from "@/lib/api-auth";
import { verifyTransactionAuth } from "@/lib/banking-security";
import { executeTransfer } from "@/lib/banking-service";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { session, error, status } = await requireBankingSession();
    if (error) return jsonError(error, status);

    const body = await request.json();
    const { accountId, amount, description, recipientName, recipientAccount, pin, securityAnswer } = body;

    if (!accountId || !amount || amount <= 0) {
      return jsonError("Invalid transfer details", 400);
    }

    await ensureDatabase();

    const auth = await verifyTransactionAuth(session.id, { pin, securityAnswer });
    if (!auth.ok) return jsonError(auth.error, auth.status);

    const result = await executeTransfer(session.id, {
      accountId,
      amount: Number(amount),
      description,
      recipientName,
      recipientAccount,
    });

    return jsonOk({
      success: true,
      reference: result.reference,
      newBalance: result.account.balance,
      transaction: {
        id: result.transaction._id.toString(),
        amount: result.transaction.amount,
        status: result.transaction.status,
      },
    });
  } catch (err) {
    return jsonError(err.message || formatDbError(err) || "Transfer failed", err.status || 500);
  }
}
