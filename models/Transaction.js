import mongoose from "mongoose";
import { TRANSACTION_TYPES, TRANSACTION_STATUS } from "@/lib/constants";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TRANSACTION_TYPES),
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "USD" },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
    },
    description: { type: String },
    recipientAccount: { type: String },
    reference: { type: String, unique: true, sparse: true },
    reversalOf: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    reversedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
