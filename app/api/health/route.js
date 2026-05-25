import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/env";
import { connectDB, getConnectionState } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const configured = isDbConfigured();
  let dbStatus = "not_configured";
  let dbError = null;

  if (configured) {
    try {
      await connectDB();
      dbStatus = getConnectionState();
    } catch (err) {
      dbStatus = "error";
      dbError = err.message;
    }
  }

  return NextResponse.json({
    status: "ok",
    service: "VentureBank API",
    database: {
      configured,
      status: dbStatus,
      error: dbError,
    },
    timestamp: new Date().toISOString(),
  });
}
