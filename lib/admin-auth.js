import { assertAdminEmailWhitelisted } from "@/lib/auth-register";
import User from "@/models/User";
import { USER_ROLES } from "@/lib/constants";
import bcrypt from "bcryptjs";

export async function ensureAdminUser(email, password, firstName = "Admin", lastName = "User") {
  assertAdminEmailWhitelisted(email);
  const normalized = email.toLowerCase().trim();
  let user = await User.findOne({ email: normalized }).select("+password");
  const hashed = await bcrypt.hash(password, 12);
  let upgraded = false;

  if (user) {
    if (user.role !== USER_ROLES.ADMIN) {
      upgraded = true;
      user.role = USER_ROLES.ADMIN;
    }
    user.password = hashed;
    user.isActive = true;
    user.emailVerified = true;
    await user.save();
    return { user, upgraded, updated: true };
  }

  user = await User.create({
    firstName,
    lastName,
    email: normalized,
    password: hashed,
    role: USER_ROLES.ADMIN,
    emailVerified: true,
    isActive: true,
    pinSet: false,
  });

  return { user, upgraded: false, updated: false };
}
