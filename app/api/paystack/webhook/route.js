import { jsonError, jsonOk } from "@/lib/api-utils";
import { verifyPaystackWebhookSignature, verifyPaystackTransaction } from "@/lib/paystack";
import { completePaystackDeposit } from "@/lib/banking-service";

export const runtime = "nodejs";

export async function POST(request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackWebhookSignature(rawBody, signature)) {
    return jsonError("Invalid webhook signature", 401);
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return jsonError("Malformed webhook payload", 400);
  }

  if (payload.event !== "charge.success" || !payload.data?.reference) {
    return jsonOk({ received: true });
  }

  const reference = payload.data.reference;

  try {
    const verified = await verifyPaystackTransaction(reference);
    if (verified.status !== "success") {
      return jsonOk({ received: true, warning: "Paystack transaction is not successful" });
    }

    await completePaystackDeposit({
      reference,
      amountKobo: verified.amount,
      currency: verified.currency,
      gatewayResponse: verified,
    });

    return jsonOk({ received: true });
  } catch (err) {
    const message = err?.message || "Webhook processing failed";
    if (message.includes("already completed") || message.includes("not found") || message.includes("Amount mismatch")) {
      return jsonOk({ received: true, warning: message });
    }
    return jsonError(message, 500);
  }
}
