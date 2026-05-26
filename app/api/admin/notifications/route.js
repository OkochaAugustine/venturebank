import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireAdminSession } from "@/lib/api-auth";
import Notification from "@/models/Notification";
import { getUnreadCount } from "@/lib/notification-service";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { session, error, status } = await requireAdminSession();
    if (error) return jsonError(error, status);

    await ensureDatabase();

    const limit = Number(request.nextUrl.searchParams.get("limit") || 50);
    const since = request.nextUrl.searchParams.get("since");

    const query = { userId: session.id };
    if (since) query.createdAt = { $gt: new Date(since) };

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const unreadCount = await getUnreadCount(session.id);

    return jsonOk({
      notifications: notifications.map((n) => ({
        id: n._id.toString(),
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        priority: n.priority,
        createdAt: n.createdAt,
        metadata: n.metadata,
      })),
      unreadCount,
    });
  } catch (err) {
    return jsonError(formatDbError(err) || "Failed to load notifications", 500);
  }
}

export async function PATCH(request) {
  try {
    const { session, error, status } = await requireAdminSession();
    if (error) return jsonError(error, status);

    const body = await request.json();
    await ensureDatabase();

    if (body.markAllRead) {
      await Notification.updateMany({ userId: session.id, read: false }, { read: true });
    } else if (Array.isArray(body.notificationIds) && body.notificationIds.length) {
      await Notification.updateMany(
        { _id: { $in: body.notificationIds }, userId: session.id },
        { read: true }
      );
    }

    const unreadCount = await getUnreadCount(session.id);
    return jsonOk({ success: true, unreadCount });
  } catch (err) {
    return jsonError(formatDbError(err) || "Update failed", 500);
  }
}
