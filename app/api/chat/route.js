import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { ensureDatabase, formatDbError } from "@/lib/auth-helpers";
import { requireApiSession } from "@/lib/api-auth";
import Message from "@/models/Message";
import { USER_ROLES } from "@/lib/constants";
import { notifyChatMessage } from "@/lib/notification-service";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { session, error, status } = await requireApiSession();
    if (error) return NextResponse.json({ error }, { status });

    await ensureDatabase();

    const since = request.nextUrl.searchParams.get("since");
    const query = { userId: session.id };
    if (since) {
      query.createdAt = { $gt: new Date(since) };
    }

    const messages = await Message.find(query).sort({ createdAt: 1 }).limit(200).lean();

    return NextResponse.json({
      messages: messages.map((m) => ({
        id: m._id.toString(),
        content: m.content,
        senderRole: m.senderRole,
        isOwn: m.senderRole === USER_ROLES.USER,
        createdAt: m.createdAt,
        read: m.read,
      })),
    });
  } catch (err) {
    const msg = formatDbError(err);
    return NextResponse.json({ error: msg || "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { session, error, status } = await requireApiSession();
    if (error) return NextResponse.json({ error }, { status });

    const { content } = await request.json();
    if (!content?.trim()) {
      return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 });
    }

    await ensureDatabase();

    const message = await Message.create({
      userId: new mongoose.Types.ObjectId(session.id),
      senderId: new mongoose.Types.ObjectId(session.id),
      senderRole: USER_ROLES.USER,
      content: content.trim(),
      read: false,
    });

    await notifyChatMessage({
      userId: session.id,
      content: content.trim(),
      messageId: message._id,
      fromAdmin: false,
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
    return NextResponse.json({ error: msg || "Failed to send message" }, { status: 500 });
  }
}
