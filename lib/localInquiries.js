import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE_PATH = path.join(DATA_DIR, "inquiries.json");

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.writeFile(FILE_PATH, "[]", "utf8");
  }
}

async function readAll() {
  await ensureStore();
  const raw = await fs.readFile(FILE_PATH, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(items) {
  await ensureStore();
  await fs.writeFile(FILE_PATH, JSON.stringify(items, null, 2), "utf8");
}

export async function listLocalInquiries() {
  const items = await readAll();
  return items.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createLocalInquiry(payload) {
  const items = await readAll();
  const doc = {
    _id: crypto.randomBytes(12).toString("hex"),
    ...payload,
    isRead: false,
    isDone: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    _local: true,
  };
  items.unshift(doc);
  await writeAll(items);
  return doc;
}

export async function updateLocalInquiry(id, patch) {
  const items = await readAll();
  const index = items.findIndex((item) => String(item._id) === String(id));
  if (index === -1) return null;
  const cleanPatch = Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value !== undefined)
  );
  items[index] = {
    ...items[index],
    ...cleanPatch,
    updatedAt: new Date().toISOString(),
  };
  await writeAll(items);
  return items[index];
}

export async function deleteLocalInquiry(id) {
  const items = await readAll();
  const next = items.filter((item) => String(item._id) !== String(id));
  if (next.length === items.length) return false;
  await writeAll(next);
  return true;
}
