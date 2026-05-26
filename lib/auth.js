import jwt from "jsonwebtoken";
import { getJwtSecret } from "@/lib/env";

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function signingSecret() {
  return getJwtSecret();
}

export function signToken(payload) {
  return jwt.sign(payload, signingSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, signingSecret());
}
