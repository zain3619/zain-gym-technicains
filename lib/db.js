import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/zaingym";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
    failedAt: 0,
    failError: null,
  };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  // Avoid hammering Atlas DNS when offline (10s cooldown)
  if (cached.failError && Date.now() - cached.failedAt < 10000) {
    throw cached.failError;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    };

    cached.promise = mongoose
      .connect(MONGO_URI, opts)
      .then((mongooseInstance) => {
        cached.failError = null;
        cached.failedAt = 0;
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.failedAt = Date.now();
    cached.failError = e;
    if (process.env.NODE_ENV === "development") {
      console.warn(
        `[db] Mongo unavailable (${e.code || e.name}). Site using local fallbacks.`
      );
    }
    throw e;
  }

  return cached.conn;
}
