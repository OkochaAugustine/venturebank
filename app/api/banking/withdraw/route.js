import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireBankingSession } from "@/lib/api-auth";
import { verifyTransactionAuth } from "@/lib/banking-security";
import { createWithdrawalRequest } from "@/lib/banking-service";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { session, error, status } = await requireBankingSession();
    if (error) return jsonError(error, status);

    const body = await request.json();
    const { accountId, amount, description, pin } = body;

    if (!accountId || !amount || amount <= 0) {
      return jsonError("Invalid withdrawal details", 400);
    }

    await ensureDatabase();

    const auth = await verifyTransactionAuth(session.id, { pin });
    if (!auth.ok) return jsonError(auth.error, auth.status);

    const result = await createWithdrawalRequest(session.id, {
      accountId,
      amount: Number(amount),
      description,
    });

    return jsonOk({
      success: true,
      reference: result.reference,
      status: "pending_security",
      message:
        "Withdrawal request received. For your security, contact VentureBank at 1-800-VENTURE or use live chat to obtain your withdrawal security code. Funds will not be released until the code is verified by our team.",
      supportPhone: "1-800-VENTURE",
      request: {
        id: result.request._id.toString(),
        amount: result.request.amount,
        status: result.request.status,
      },
    });
  } catch (err) {
    return jsonError(err.message || formatDbError(err) || "Withdrawal request failed", err.status || 500);
  }
}
