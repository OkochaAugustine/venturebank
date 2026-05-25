import { isWhitelistedAdminEmail } from "@/lib/env";
import User from "@/models/User";
import { USER_ROLES } from "@/lib/constants";

/** Member registration must never use admin-reserved emails */
export function assertMemberEmailAllowed(email) {
  const normalized = email?.toLowerCase().trim();
  if (isWhitelistedAdminEmail(normalized)) {
    const err = new Error(
      "This email is reserved for administrator access. Register at /admin/register or use a different email for online banking."
    );
    err.code = "ADMIN_EMAIL_RESERVED";
    throw err;
  }
}

export async function assertMemberEmailAvailable(email) {
  const normalized = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalized });
  if (existing) {
    const err = new Error("An account with this email already exists. Sign in instead.");
    err.code = "EMAIL_EXISTS";
    throw err;
  }
}

/** Admin registration — whitelist only; may upgrade existing user to admin */
export function assertAdminEmailWhitelisted(email) {
  const normalized = email?.toLowerCase().trim();
  if (!isWhitelistedAdminEmail(normalized)) {
    const err = new Error(
      "This email is not authorized for admin registration. Add it to ADMIN_WHITELIST_EMAILS in .env.local, then restart the server."
    );
    err.code = "ADMIN_NOT_WHITELISTED";
    throw err;
  }
}

export async function findUserByEmail(email) {
  return User.findOne({ email: email.toLowerCase().trim() });
}

export function buildAuthPayload(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    pinSet: Boolean(user.pinSet),
  };
}
