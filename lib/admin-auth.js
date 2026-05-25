import { isWhitelistedAdminEmail, getAdminWhitelist } from "@/lib/env";
import User from "@/models/User";
import { USER_ROLES } from "@/lib/constants";
import bcrypt from "bcryptjs";

export function assertAdminEmailAllowed(email) {
  if (!isWhitelistedAdminEmail(email)) {
    const allowed = getAdminWhitelist().join(", ");
    throw new Error(
      `Access denied. Only authorized admin emails may sign in. Contact system administrator.`
    );
  }
}

export async function ensureAdminUser(email, password, firstName = "Admin", lastName = "User") {
  assertAdminEmailAllowed(email);
  const normalized = email.toLowerCase().trim();
  let user = await User.findOne({ email: normalized }).select("+password");

  const hashed = await bcrypt.hash(password, 12);

  if (user) {
    if (user.role !== USER_ROLES.ADMIN) {
      user.role = USER_ROLES.ADMIN;
    }
    user.password = hashed;
    user.isActive = true;
    user.emailVerified = true;
    await user.save();
    return user;
  }

  user = await User.create({
    firstName,
    lastName,
    email: normalized,
    password: hashed,
    role: USER_ROLES.ADMIN,
    emailVerified: true,
    isActive: true,
  });

  return user;
}
