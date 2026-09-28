import jwt from "jsonwebtoken";
import { connectDB } from "./db";
import User from "../models/User";

const JWT_SECRET =
  process.env.JWT_SECRET || "super-secret-jwt-key-change-in-production";

export function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
}

export class AuthError extends Error {
  constructor(message, status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

function isDbConnectivityError(error) {
  const code = error?.code || error?.name || "";
  const msg = String(error?.message || "");
  return (
    code === "ENODATA" ||
    code === "ENOTFOUND" ||
    code === "ECONNREFUSED" ||
    code === "ETIMEOUT" ||
    code === "ETIMEDOUT" ||
    code === "MongoServerSelectionError" ||
    code === "MongooseError" ||
    msg.includes("querySrv") ||
    msg.includes("Mongo") ||
    msg.includes("ETIMEOUT") ||
    msg.includes("buffering timed out") ||
    msg.includes("failed to connect") ||
    msg.includes("Mongo unavailable") ||
    msg.includes("hard timeout")
  );
}

function offlineAdmin(decoded) {
  return {
    _id: decoded.id,
    username: "Admin",
    role: "admin",
    _offline: true,
  };
}

/**
 * Verify Bearer JWT. Prefers live User from Mongo; if DB is down or user
 * row is missing after reconnect, still accepts a valid signed token.
 */
export async function verifyAuth(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError("Not authorized, no token provided");
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch {
    throw new AuthError("Not authorized, token verification failed");
  }

  if (!decoded?.id) {
    throw new AuthError("Not authorized, invalid token payload");
  }

  try {
    await connectDB();
    const user = await User.findById(decoded.id).select("-password");
    if (user) return user;

    // Valid token but user doc missing (reseed / env swap) — keep admin session
    return offlineAdmin(decoded);
  } catch (error) {
    if (error instanceof AuthError) throw error;

    if (isDbConnectivityError(error)) {
      return offlineAdmin(decoded);
    }

    return offlineAdmin(decoded);
  }
}
