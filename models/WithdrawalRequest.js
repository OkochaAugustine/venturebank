import mongoose from "mongoose";
import { WITHDRAWAL_REQUEST_STATUS } from "@/lib/constants";

const withdrawalRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    amount: { type: Number, required: true, min: 0.01 },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: Object.values(WITHDRAWAL_REQUEST_STATUS),
      default: WITHDRAWAL_REQUEST_STATUS.PENDING_SECURITY,
    },
    description: { type: String },
    reference: { type: String, unique: true, sparse: true },
    securityCodeApproved: { type: Boolean, default: false },
    securityCodeApprovedAt: { type: Date },
    securityCodeApprovedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.WithdrawalRequest ||
  mongoose.model("WithdrawalRequest", withdrawalRequestSchema);
