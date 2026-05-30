import mongoose from "mongoose";
import { USER_ROLES } from "@/lib/constants";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    avatar: { type: String },
    phone: { type: String, trim: true },
    emailVerified: { type: Boolean, default: false },
    pinHash: { type: String, select: false },
    pinSet: { type: Boolean, default: false },
    kycStatus: {
      type: String,
      enum: ["none", "pending", "verified", "rejected"],
      default: "none",
    },
    kycSubmittedAt: { type: Date },
    kycData: { type: mongoose.Schema.Types.Mixed },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
