import { connectDB, getConnectionState } from "@/lib/db";
import { isDbConfigured } from "@/lib/env";
import Account from "@/models/Account";
import { ACCOUNT_TYPES } from "@/lib/constants";

function generateAccountNumber() {
  return String(Math.floor(1000000000 + Math.random() * 9000000000));
}

export function isMongoConnectionError(err) {
  if (!err) return false;
  const msg = String(err.message || "");
  return (
    err.code === "ECONNREFUSED" ||
    err.code === "ENOTFOUND" ||
    err.name === "MongooseServerSelectionError" ||
    err.name === "MongoServerSelectionError" ||
    msg.includes("ECONNREFUSED") ||
    msg.includes("connect ECONNREFUSED") ||
    msg.includes("Server selection timed out")
  );
}

export async function ensureDatabase() {
  if (!isDbConfigured()) {
    const err = new Error(
      "MONGODB_URI is not defined. Add it to .env.local in the project root."
    );
    err.code = "ENV_MISSING";
    throw err;
  }

  try {
    await connectDB();
  } catch (err) {
    if (isMongoConnectionError(err)) {
      const e = new Error(
        "Cannot connect to MongoDB at 127.0.0.1:27017. Start MongoDB locally, or set MONGODB_URI in .env.local to your MongoDB Atlas connection string (mongodb+srv://...), then restart npm run dev."
      );
      e.code = "DB_CONN_REFUSED";
      throw e;
    }
    throw err;
  }
}

export function formatDbError(err) {
  if (!err) return "An unexpected error occurred.";

  if (err.code === "ENV_MISSING" || err.message?.includes("MONGODB_URI is not defined")) {
    return "Database is not configured. Add MONGODB_URI to .env.local and restart the dev server.";
  }

  if (err.code === "DB_CONN_REFUSED" || isMongoConnectionError(err)) {
    return "Cannot connect to MongoDB. Use MongoDB Atlas (mongodb+srv://...) or start local MongoDB, update MONGODB_URI in .env.local, and restart the server.";
  }

  if (
    err.name === "MongooseServerSelectionError" ||
    err.name === "MongoServerSelectionError"
  ) {
    return "Cannot reach MongoDB. Check your MONGODB_URI in .env.local and network access (Atlas IP whitelist).";
  }

  if (err.code === 11000) {
    return "An account with this email already exists.";
  }

  return null;
}

export function getDbStatus() {
  return {
    configured: isDbConfigured(),
    state: getConnectionState(),
  };
}

export async function createMemberAccounts(userId) {
  const accounts = [
    {
      userId,
      name: "Primary Checking",
      accountType: ACCOUNT_TYPES.CHECKING,
      balance: 0,
      accountNumber: generateAccountNumber(),
    },
    {
      userId,
      name: "Premium Savings",
      accountType: ACCOUNT_TYPES.SAVINGS,
      balance: 0,
      accountNumber: generateAccountNumber(),
    },
  ];

  return Account.insertMany(accounts);
}
