import dns from "dns/promises";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/zaingym";

/** Skip reconnect attempts this long after a failure (ms). */
const FAIL_COOLDOWN_MS = 60_000;
/** Hard ceiling so stuck DNS cannot freeze API routes. */
const HARD_TIMEOUT_MS = 5_000;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
    failedAt: 0,
    failError: null,
    warned: false,
    resolvedUri: null,
  };
}

function classifyError(error) {
  const code = error?.code || error?.name || "Error";
  const msg = String(error?.message || "");
  if (
    code === "ETIMEOUT" ||
    code === "ENOTFOUND" ||
    code === "ENODATA" ||
    code === "ECONNREFUSED" ||
    code === "EAI_AGAIN" ||
    msg.includes("querySrv") ||
    msg.includes("ESERVFAIL") ||
    msg.includes("hard timeout")
  ) {
    return "network/dns";
  }
  if (msg.includes("Authentication failed") || code === 18) {
    return "auth";
  }
  return "unknown";
}

function withHardTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error(`Mongo hard timeout after ${ms}ms`);
      err.code = "ETIMEOUT";
      reject(err);
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Convert mongodb+srv:// to a standard mongodb:// URI using SRV+TXT records.
 * Avoids repeated flaky querySrv lookups inside the Mongo driver.
 */
async function resolveSrvUri(uri) {
  if (!uri.startsWith("mongodb+srv://")) return uri;
  if (cached.resolvedUri) return cached.resolvedUri;

  const withoutProtocol = uri.slice("mongodb+srv://".length);
  const at = withoutProtocol.indexOf("@");
  if (at < 0) return uri;

  const creds = withoutProtocol.slice(0, at);
  const rest = withoutProtocol.slice(at + 1);
  const slash = rest.indexOf("/");
  const host = (slash >= 0 ? rest.slice(0, slash) : rest).split("?")[0];
  const afterHost = slash >= 0 ? rest.slice(slash) : "/";
  const qIndex = afterHost.indexOf("?");
  const dbPath = qIndex >= 0 ? afterHost.slice(0, qIndex) : afterHost;
  const existingQuery = qIndex >= 0 ? afterHost.slice(qIndex + 1) : "";

  const srv = await withHardTimeout(
    dns.resolveSrv(`_mongodb._tcp.${host}`),
    3000
  );
  if (!srv?.length) return uri;

  let authSource = "admin";
  let replicaSet = "";
  try {
    const txt = await withHardTimeout(dns.resolveTxt(host), 2000);
    const flat = txt.flat().join("");
    const as = flat.match(/authSource=([^&]+)/);
    const rs = flat.match(/replicaSet=([^&]+)/);
    if (as) authSource = as[1];
    if (rs) replicaSet = rs[1];
  } catch {
    // TXT optional — Atlas defaults work
  }

  const hosts = srv.map((r) => `${r.name}:${r.port}`).join(",");
  const params = new URLSearchParams(existingQuery);
  params.set("authSource", params.get("authSource") || authSource);
  if (replicaSet) params.set("replicaSet", params.get("replicaSet") || replicaSet);
  params.set("ssl", "true");
  params.set("retryWrites", params.get("retryWrites") || "true");
  params.set("w", params.get("w") || "majority");

  const db = dbPath && dbPath !== "/" ? dbPath : "/zaingym";
  cached.resolvedUri = `mongodb://${creds}@${hosts}${db}?${params.toString()}`;
  return cached.resolvedUri;
}

async function attemptConnect(uri) {
  return mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: HARD_TIMEOUT_MS - 800,
    connectTimeoutMS: HARD_TIMEOUT_MS - 800,
    family: 4,
  });
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (cached.failError && Date.now() - cached.failedAt < FAIL_COOLDOWN_MS) {
    throw cached.failError;
  }

  if (!cached.promise) {
    cached.promise = withHardTimeout(
      (async () => {
        let lastError;
        // 1) Prefer pre-resolved standard URI (more stable on flaky router DNS)
        try {
          const resolved = await resolveSrvUri(MONGO_URI);
          const inst = await attemptConnect(resolved);
          return inst;
        } catch (e) {
          lastError = e;
          cached.resolvedUri = null;
          try {
            await mongoose.disconnect();
          } catch {
            // ignore
          }
        }
        // 2) Fallback: original mongodb+srv (driver does its own SRV lookup)
        try {
          return await attemptConnect(MONGO_URI);
        } catch (e) {
          throw e || lastError;
        }
      })().then((mongooseInstance) => {
        cached.failError = null;
        cached.failedAt = 0;
        cached.warned = false;
        if (process.env.NODE_ENV === "development") {
          console.info("[db] Mongo connected.");
        }
        return mongooseInstance;
      }),
      HARD_TIMEOUT_MS + 2500
    );
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.failedAt = Date.now();
    cached.failError = e;
    cached.resolvedUri = null;
    try {
      await mongoose.disconnect();
    } catch {
      // ignore
    }
    if (process.env.NODE_ENV === "development" && !cached.warned) {
      cached.warned = true;
      const kind = classifyError(e);
      console.warn(
        `[db] Mongo unavailable (${e.code || e.name}, ${kind}). Local fallbacks for ${FAIL_COOLDOWN_MS / 1000}s.`
      );
      if (kind === "network/dns") {
        console.warn(
          "[db] IP Access List OK hone ke bawajood DNS timeout ho sakta hai (router DNS). Dev server restart karo; DNS 8.8.8.8 try karo."
        );
      }
    }
    throw e;
  }

  return cached.conn;
}
