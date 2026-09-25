#!/usr/bin/env node
/**
 * Re-download Cloudinary images into public/media and refresh media-map.json.
 * Run: node scripts/sync-media.js
 */
const fs = require("fs");
const path = require("path");
const https = require("https");
const mongoose = require("mongoose");
const sharp = require("sharp");

function get(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { timeout: 45000, headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location).then(resolve, reject);
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

function slug(s) {
  return String(s || "img")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

function publicId(url) {
  const m = String(url).match(/\/upload\/(?:[^/]+\/)*?(v\d+\/.+)$/);
  if (!m) return null;
  return m[1].replace(/\.(png|jpe?g|webp|gif)$/i, "");
}

(async () => {
  const env = fs.readFileSync(".env.local", "utf8");
  const uri = env.match(/^MONGO_URI=(.*)$/m)[1].trim();
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
  const db = mongoose.connection.db;

  const items = [];
  for (const d of await db.collection("galleries").find({}).toArray()) {
    if (d.imageUrl?.includes("cloudinary"))
      items.push({ key: `gallery-${slug(d.category)}-${String(d._id).slice(-6)}`, url: d.imageUrl });
  }
  for (const d of await db.collection("teams").find({}).toArray()) {
    if (d.imageUrl?.includes("cloudinary"))
      items.push({ key: `team-${slug(d.name)}-${String(d._id).slice(-6)}`, url: d.imageUrl });
  }
  for (const d of await db.collection("abouts").find({}).toArray()) {
    if (d.imageUrl?.includes("cloudinary"))
      items.push({ key: `about-${String(d._id).slice(-6)}`, url: d.imageUrl });
  }
  for (const d of await db.collection("testimonials").find({}).toArray()) {
    if (d.imageUrl?.includes("cloudinary"))
      items.push({
        key: `testimonial-${slug(d.name)}-${String(d._id).slice(-6)}`,
        url: d.imageUrl,
      });
  }

  await mongoose.disconnect();

  const seen = new Map();
  for (const it of items) if (!seen.has(it.url)) seen.set(it.url, it.key);

  const outDir = path.join("public", "media");
  fs.mkdirSync(outDir, { recursive: true });
  const byUrl = {};
  const byId = {};

  for (const [url, key] of seen) {
    try {
      const fetchUrl = url.replace(/\/upload\/(?!v\d)[^/]+\//, "/upload/");
      const buf = await get(fetchUrl);
      const outRel = `/media/${key}.webp`;
      await sharp(buf)
        .rotate()
        .resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 78, effort: 4 })
        .toFile(path.join("public", "media", `${key}.webp`));
      byUrl[url] = outRel;
      byUrl[fetchUrl] = outRel;
      const id = publicId(url);
      if (id) byId[id] = outRel;
      console.log("OK", key);
    } catch (e) {
      console.log("FAIL", key, e.message.slice(0, 100));
    }
  }

  fs.mkdirSync("app/lib", { recursive: true });
  fs.writeFileSync(
    "app/lib/media-map.json",
    JSON.stringify({ byId, byUrl }, null, 2)
  );
  console.log("Done. Mapped", Object.keys(byId).length, "assets.");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
