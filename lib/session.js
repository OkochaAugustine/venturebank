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
