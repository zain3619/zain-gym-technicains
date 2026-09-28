import { promises as fs } from "fs";
import path from "path";
import { convertImageToWebp, ensureWebpFilename } from "./optimizeMedia";

const DATA_DIR = path.join(process.cwd(), ".data");
const PROFILE_PATH = path.join(DATA_DIR, "admin-profile.json");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "profiles");

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function readLocalProfile() {
  await ensureDirs();
  try {
    const raw = await fs.readFile(PROFILE_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function writeLocalProfile(profile) {
  await ensureDirs();
  await fs.writeFile(PROFILE_PATH, JSON.stringify(profile, null, 2), "utf8");
  return profile;
}

export async function saveLocalProfileImage(buffer, originalName = "avatar.jpg") {
  await ensureDirs();
  const converted = await convertImageToWebp(buffer, {
    quality: 82,
    maxWidth: 1200,
    maxHeight: 1200,
  });
  const filename = ensureWebpFilename(originalName || "avatar.jpg");
  const filePath = path.join(UPLOAD_DIR, filename);
  await fs.writeFile(filePath, converted.buffer);
  return `/uploads/profiles/${filename}`;
}
