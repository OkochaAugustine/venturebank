/**
 * Run: npm run seed:admin
 * Loads .env.local from project root
 */
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const eq = trimmed.indexOf("=");
    if (eq === -1) return;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@Venture2026!";
const emails = (process.env.ADMIN_WHITELIST_EMAILS || "okochaaugustine158@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, default: "admin" },
  emailVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
});

async function seed() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI missing in .env.local");
    process.exit(1);
  }
  await mongoose.connect(MONGODB_URI);
  const User = mongoose.models.User || mongoose.model("User", userSchema);
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);

  for (const email of emails) {
    const existing = await User.findOne({ email });
    if (existing) {
      existing.password = hashed;
      existing.role = "admin";
      existing.isActive = true;
      await existing.save();
      console.log("Updated admin:", email);
    } else {
      await User.create({
        firstName: "Venture",
        lastName: "Admin",
        email,
        password: hashed,
        role: "admin",
        emailVerified: true,
      });
      console.log("Created admin:", email);
    }
  }

  console.log("Password:", ADMIN_PASSWORD);
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
