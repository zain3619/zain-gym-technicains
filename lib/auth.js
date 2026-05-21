import jwt from "jsonwebtoken";
import { connectDB } from "./db";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-change-in-production";

export function generateToken(id) {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "30d",
  });
}

export async function verifyAuth(request) {
  await connectDB();
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Not authorized, no token provided");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      throw new Error("Not authorized, user not found");
    }
    return user;
  } catch (error) {
    throw new Error("Not authorized, token verification failed");
  }
}
