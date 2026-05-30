import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireApiSession } from "@/lib/api-auth";
import {
  getUserNotifications,
  getUnreadCount,
} from "@/lib/notification-service";
import Notification from "@/models/Notification";
import { jsonError, jsonOk } from "@/lib/api-utils";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { session, error, status } = await requireApiSession();
    if (error) return jsonError(error, status);
    if (!session?.id) return jsonError("Session user ID missing", 401);

    await ensureDatabase();

    const limit = Number(request.nextUrl.searchParams.get("limit") || 50);
    const since = request.nextUrl.searchParams.get("since");

    let notifications = [];
    try {
      if (since) {
        notifications = await Notification.find({
          userId: session.id,
          createdAt: { $gt: new Date(since) },
        })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean();
      } else {
        notifications = await getUserNotifications(session.id, limit);
      }
    } catch (queryErr) {
      console.error("[Notifications] Query error:", queryErr.message);
      return jsonError("Failed to fetch notifications", 500);
    }

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
        transactionId: n.transactionId?.toString(),
      })),
      unreadCount,
    });
  } catch (err) {
    return jsonError(formatDbError(err) || "Failed to load notifications", 500);
  }
}

export async function PATCH(request) {
  try {
    const { session, error, status } = await requireApiSession();
    if (error) return jsonError(error, status);
    if (!session?.id) return jsonError("Session user ID missing", 401);

    const body = await request.json();
    if (!body) return jsonError("Request body required", 400);
    const { notificationIds, markAllRead } = body;

    await ensureDatabase();

    try {
      if (markAllRead) {
        await Notification.updateMany({ userId: session.id, read: false }, { read: true });
      } else if (Array.isArray(notificationIds) && notificationIds.length) {
        await Notification.updateMany(
          { _id: { $in: notificationIds }, userId: session.id },
          { read: true }
        );
      }
    } catch (updateErr) {
      console.error("[Notifications] Update error:", updateErr.message);
      return jsonError("Failed to update notifications", 500);
    }

    const unreadCount = await getUnreadCount(session.id);
    return jsonOk({ success: true, unreadCount });
  } catch (err) {
    return jsonError(formatDbError(err) || "Update failed", 500);
  }
}
