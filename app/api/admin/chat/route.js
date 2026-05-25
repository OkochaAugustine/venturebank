import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireAdminSession } from "@/lib/api-auth";
import Message from "@/models/Message";
import User from "@/models/User";
import { USER_ROLES } from "@/lib/constants";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { session, error, status } = await requireAdminSession();
    if (error) return NextResponse.json({ error }, { status });

    await ensureDatabase();

    const userId = request.nextUrl.searchParams.get("userId");
    const since = request.nextUrl.searchParams.get("since");

    if (userId) {
      const query = { userId };
      if (since) query.createdAt = { $gt: new Date(since) };

      const messages = await Message.find(query).sort({ createdAt: 1 }).limit(300).lean();
      return NextResponse.json({
        messages: messages.map((m) => ({
          id: m._id.toString(),
          content: m.content,
          senderRole: m.senderRole,
          isOwn: m.senderRole === USER_ROLES.ADMIN,
          createdAt: m.createdAt,
        })),
      });
    }

    const threads = await Message.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$userId",
          lastMessage: { $first: "$content" },
          lastAt: { $first: "$createdAt" },
          unread: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$senderRole", USER_ROLES.USER] },
                    { $eq: ["$read", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      { $sort: { lastAt: -1 } },
      { $limit: 50 },
    ]);

    const userIds = threads.map((t) => t._id);
    const users = await User.find({ _id: { $in: userIds } })
      .select("firstName lastName email")
      .lean();
    const userMap = Object.fromEntries(users.map((u) => [u._id.toString(), u]));

    return NextResponse.json({
      threads: threads.map((t) => {
        const u = userMap[t._id.toString()];
        return {
          userId: t._id.toString(),
          name: u ? `${u.firstName} ${u.lastName}` : "Unknown",
          email: u?.email,
          lastMessage: t.lastMessage,
          lastAt: t.lastAt,
          unread: t.unread,
        };
      }),
    });
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Failed to load chat" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { session, error, status } = await requireAdminSession();
    if (error) return NextResponse.json({ error }, { status });

    const { userId, content } = await request.json();
    if (!userId || !content?.trim()) {
      return NextResponse.json({ error: "userId and content required" }, { status: 400 });
    }

    await ensureDatabase();

    await Message.updateMany(
      { userId, senderRole: USER_ROLES.USER, read: false },
      { read: true }
    );

    const message = await Message.create({
      userId: new mongoose.Types.ObjectId(userId),
      senderId: new mongoose.Types.ObjectId(session.id),
      senderRole: USER_ROLES.ADMIN,
      content: content.trim(),
      read: true,
    });

    return NextResponse.json({
      message: {
        id: message._id.toString(),
        content: message.content,
        senderRole: message.senderRole,
        isOwn: true,
        createdAt: message.createdAt,
      },
    });
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Failed to send reply" }, { status: 500 });
  }
}
