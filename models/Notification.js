import mongoose from "mongoose";
import { NOTIFICATION_TYPES } from "@/lib/constants";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false, index: true },
    priority: { type: String, enum: ["normal", "high"], default: "normal" },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    withdrawalRequestId: { type: mongoose.Schema.Types.ObjectId, ref: "WithdrawalRequest" },
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
