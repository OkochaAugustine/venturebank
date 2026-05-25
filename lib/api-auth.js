import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { AUTH_COOKIE } from "@/lib/auth-cookies";
import { getJwtSecret } from "@/lib/env";
import { USER_ROLES } from "@/lib/constants";

export async function getApiSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(getJwtSecret())
    );
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  } catch {
    return null;
  }
}

export async function requireApiSession() {
  const session = await getApiSession();
  if (!session) {
    return { error: "Unauthorized", status: 401, session: null };
  }
  return { session, error: null, status: null };
}

export async function requireAdminSession() {
  const result = await requireApiSession();
  if (result.error) return result;
  if (result.session.role !== USER_ROLES.ADMIN) {
    return { error: "Forbidden", status: 403, session: null };
  }
  return result;
}
