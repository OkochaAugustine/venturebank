import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireAdminSession } from "@/lib/api-auth";
import { approveWithdrawal } from "@/lib/banking-service";
import WithdrawalRequest from "@/models/WithdrawalRequest";
import User from "@/models/User";
import Account from "@/models/Account";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { error, status } = await requireAdminSession();
    if (error) return jsonError(error, status);

    await ensureDatabase();

    const statusFilter = request.nextUrl.searchParams.get("status");
    const query = statusFilter ? { status: statusFilter } : {};

    const requests = await WithdrawalRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const userIds = [...new Set(requests.map((r) => r.userId.toString()))];
    const users = await User.find({ _id: { $in: userIds } })
      .select("firstName lastName email")
      .lean();
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    const accountIds = requests.map((r) => r.accountId);
    const accounts = await Account.find({ _id: { $in: accountIds } }).lean();
    const accountMap = Object.fromEntries(accounts.map((a) => [a._id.toString(), a]));

    return jsonOk({
      requests: requests.map((r) => {
        const u = userMap[r.userId.toString()];
        const a = accountMap[r.accountId.toString()];
        return {
          id: r._id.toString(),
          userId: r.userId.toString(),
          userName: u ? `${u.firstName} ${u.lastName}` : "Unknown",
          email: u?.email,
          accountName: a?.name,
          accountNumber: a?.accountNumber,
          amount: r.amount,
          status: r.status,
          reference: r.reference,
          description: r.description,
          securityCodeApproved: r.securityCodeApproved,
          createdAt: r.createdAt,
        };
      }),
    });
  } catch (err) {
    return jsonError(formatDbError(err) || "Failed to load withdrawals", 500);
  }
}

export async function PATCH(request) {
  try {
    const { session, error, status } = await requireAdminSession();
    if (error) return jsonError(error, status);

    const body = await request.json();
    const { requestId, action, securityCode } = body;

    if (!requestId) return jsonError("requestId required", 400);

    await ensureDatabase();

    if (action === "approve") {
      const result = await approveWithdrawal(requestId, session.id, securityCode);
      return jsonOk({
        success: true,
        reference: result.transaction.reference,
        newBalance: result.account.balance,
      });
    }

    if (action === "reject") {
      const req = await WithdrawalRequest.findById(requestId);
      if (!req) return jsonError("Request not found", 404);
      req.status = "rejected";
      await req.save();
      return jsonOk({ success: true });
    }

    return jsonError("Unknown action", 400);
  } catch (err) {
    return jsonError(err.message || formatDbError(err) || "Update failed", err.status || 500);
  }
}
