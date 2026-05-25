import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, index: true },
    code: { type: String, required: true },
    type: { type: String, enum: ["register", "reset"], default: "register" },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    attempts: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

verificationCodeSchema.index({ email: 1, type: 1 });

export default mongoose.models.VerificationCode ||
  mongoose.model("VerificationCode", verificationCodeSchema);
