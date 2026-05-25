import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { AUTH_COOKIE } from "@/lib/auth-cookies";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import User from "@/models/User";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const token = (await cookies()).get(AUTH_COOKIE)?.value;
    if (!token) return jsonError("Not authenticated", 401);

    let session;
    try {
      session = verifyToken(token);
    } catch {
      return jsonError("Session expired", 401);
    }

    const body = await request.json();
    const { fullName, dateOfBirth, idType, idNumber, address, country } = body;

    if (!fullName?.trim() || !dateOfBirth || !idType || !idNumber?.trim() || !address?.trim()) {
      return jsonError("Complete all required identity fields", 400);
    }

    await ensureDatabase();

    const user = await User.findById(session.id);
    if (!user) return jsonError("User not found", 404);

    if (user.kycStatus === "verified") {
      return jsonError("Identity is already verified", 400);
    }

    user.kycStatus = "pending";
    user.kycSubmittedAt = new Date();
    user.kycData = {
      fullName: fullName.trim(),
      dateOfBirth,
      idType,
      idNumber: idNumber.trim(),
      address: address.trim(),
      country: country?.trim() || "",
      submittedAt: new Date().toISOString(),
    };
    await user.save();

    return jsonOk({
      success: true,
      kycStatus: user.kycStatus,
      message: "Documents submitted. We will review within 1–2 business days.",
    });
  } catch (err) {
    return jsonError(formatDbError(err) || "Submission failed", 500);
  }
}
