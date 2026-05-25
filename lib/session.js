import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { AUTH_COOKIE } from "@/lib/auth-cookies";
import { getJwtSecret } from "@/lib/env";

function secretKey() {
  return new TextEncoder().encode(getJwtSecret());
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
      pinSet: Boolean(payload.pinSet),
    };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) return null;
  return session;
}

export async function getSessionUser() {
  const session = await getSession();
  if (!session?.id) return null;

  try {
    const { default: User } = await import("@/models/User");
    const { connectDB } = await import("@/lib/db");
    await connectDB();
    const user = await User.findById(session.id).select(
      "firstName lastName email phone kycStatus pinSet role"
    );
    if (!user) return { ...session };
    return {
      ...session,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      kycStatus: user.kycStatus,
      pinSet: user.pinSet,
      role: user.role,
    };
  } catch {
    return session;
  }
}
