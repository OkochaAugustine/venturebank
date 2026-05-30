import { requireBankingSession } from "@/lib/api-auth";
import { verifyTransactionAuth } from "@/lib/banking-security";
import { createDepositRequest } from "@/lib/banking-service";
import { jsonError, jsonOk } from "@/lib/api-utils";
import { formatDbError } from "@/lib/auth-helpers";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { session, error, status } = await requireBankingSession();
    if (error) return jsonError(error, status);

    const body = await request.json();
    const { accountId, amount, method, description, pin } = body;

    if (!accountId || !amount || Number(amount) <= 0) {
      return jsonError("Invalid deposit details", 400);
    }

    const auth = await verifyTransactionAuth(session.id, { pin });
    if (!auth.ok) return jsonError(auth.error, auth.status);

    const result = await createDepositRequest(session.id, {
      accountId,
      amount: Number(amount),
      method: method || "wire",
      description,
    });

    return jsonOk({
      reference: result.reference,
      firstName: session.firstName,
      lastName: session.lastName,
      message: "Deposit request submitted successfully.",
    });
  } catch (err) {
    return jsonError(err.message || formatDbError(err) || "Deposit request failed", err.status || 500);
  }
}
