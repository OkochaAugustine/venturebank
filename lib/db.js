import mongoose from "mongoose";
import { getMongoUri } from "@/lib/env";

/** Register all models before any query */
import "@/models/User";
import "@/models/Account";
import "@/models/Transaction";
import "@/models/VerificationCode";
import "@/models/Message";
import "@/models/Notification";
import "@/models/WithdrawalRequest";

const globalCache = globalThis;

let cached = globalCache.mongoose;

if (!cached) {
  cached = globalCache.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  const MONGODB_URI = getMongoUri();

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("[VentureBank] MongoDB connected");
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("[VentureBank] MongoDB connection failed:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    cached.conn = null;
    throw err;
  }

  return cached.conn;
}

export async function disconnectDB() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

export function getConnectionState() {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
}
