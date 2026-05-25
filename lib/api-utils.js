import { NextResponse } from "next/server";

/** Always return JSON — never let Next emit plain-text Internal Server Error */
export function jsonError(message, status = 500, extra = {}) {
  return NextResponse.json(
    { success: false, error: message, ...extra },
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export function jsonOk(data, status = 200) {
  return NextResponse.json(
    { success: true, ...data },
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function parseJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
