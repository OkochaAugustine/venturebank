import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireBankingSession } from "@/lib/api-auth";
import { verifyTransactionAuth } from "@/lib/banking-security";
import { createDepositRequest } from "@/lib/banking-service";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { session, error, status } = await requireBankingSession();
    if (error) return jsonError(error, status);

    const body = await request.json();
    const { accountId, amount, method, description, pin, securityAnswer } = body;

    if (!accountId || !amount || amount <= 0) {
      return jsonError("Invalid deposit details", 400);
    }

    await ensureDatabase();

    const auth = await verifyTransactionAuth(session.id, { pin, securityAnswer });
    if (!auth.ok) return jsonError(auth.error, auth.status);

    const result = await createDepositRequest(session.id, {
      accountId,
      amount: Number(amount),
      method: method || "wire",
      description,
    });

    return jsonOk({
      success: true,
      reference: result.reference,
      status: "pending",
      message: "Deposit request submitted. Funds will credit after VentureBank confirms receipt.",
      transaction: {
        id: result.transaction._id.toString(),
        amount: result.transaction.amount,
        status: result.transaction.status,
      },
    });
  } catch (err) {
    return jsonError(err.message || formatDbError(err) || "Deposit request failed", err.status || 500);
  }
}
