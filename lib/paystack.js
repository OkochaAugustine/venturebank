import { createHmac } from "crypto";
import { getPaystackPublicKey, getPaystackSecretKey, getPaystackWebhookSecret } from "@/lib/env";

const BASE_URL = "https://api.paystack.co";

export function verifyPaystackWebhookSignature(rawBody, signature) {
  if (!signature) return false;
  const expected = createHmac("sha512", getPaystackWebhookSecret())
    .update(rawBody)
    .digest("hex");
  return expected === signature;
}

export async function verifyPaystackTransaction(reference) {
  const secretKey = getPaystackSecretKey();
  const response = await fetch(`${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();
  if (!result || !result.status) {
    throw new Error("Unable to verify Paystack transaction");
  }
  if (!result.data) {
    throw new Error("Invalid Paystack verification response");
  }
  return result.data;
}

export function getPaystackClientKey() {
  return getPaystackPublicKey();
}
