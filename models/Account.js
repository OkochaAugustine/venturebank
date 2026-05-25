import mongoose from "mongoose";
import { ACCOUNT_TYPES } from "@/lib/constants";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountNumber: { type: String, required: true, unique: true },
    accountType: {
      type: String,
      enum: Object.values(ACCOUNT_TYPES),
      default: ACCOUNT_TYPES.CHECKING,
    },
    balance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "USD" },
    name: { type: String, default: "Primary Account" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Account ||
  mongoose.model("Account", accountSchema);
