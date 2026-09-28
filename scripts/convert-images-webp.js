#!/usr/bin/env node
/**
 * Convert any image under public/ (and public/media) to WebP.
 * Skips favicons. Usage: node scripts/convert-images-webp.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOTS = [path.join("public"), path.join("public", "media")];
const SKIP = /^(favicon|apple-icon|icon)(-|\.)/i;

async function convertFile(src) {
  const ext = path.extname(src).toLowerCase();
  if (!/\.(png|jpe?g|gif|tiff?)$/i.test(ext)) return;
  const base = path.basename(src);
  if (SKIP.test(base)) return;

  const dest = src.replace(/\.(png|jpe?g|gif|tiff?)$/i, ".webp");
  try {
    await sharp(src)
      .rotate()
      .resize({
        width: 2400,
        height: 2400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 5, smartSubsample: true })
      .toFile(dest);
    const inKb = (fs.statSync(src).size / 1024).toFixed(0);
    const outKb = (fs.statSync(dest).size / 1024).toFixed(0);
    console.log(`${base}: ${inKb}KB → ${path.basename(dest)} ${outKb}KB`);
  } catch (e) {
    console.error("fail", src, e.message);
  }
}

async function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === "uploads") continue;
      await walk(full);
    } else {
      await convertFile(full);
    }
  }
}

(async () => {
  for (const root of ROOTS) await walk(root);
  console.log("Done.");
})();
