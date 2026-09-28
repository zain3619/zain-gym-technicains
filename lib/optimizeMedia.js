import sharp from "sharp";
import path from "path";
import crypto from "crypto";

/**
 * Convert any common image buffer to optimized WebP.
 * Returns original buffer if conversion fails (e.g. SVG).
 */
export async function convertImageToWebp(buffer, options = {}) {
  const {
    quality = 82,
    maxWidth = 2400,
    maxHeight = 2400,
  } = options;

  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("convertImageToWebp requires a Buffer");
  }

  try {
    const image = sharp(buffer, { failOn: "none" }).rotate();
    const meta = await image.metadata();

    // Don't re-encode SVG / animated GIFs into lossy stills blindly
    if (meta.format === "svg") {
      return { buffer, ext: ".svg", mime: "image/svg+xml", converted: false };
    }

    let pipeline = image;
    if (
      (meta.width && meta.width > maxWidth) ||
      (meta.height && meta.height > maxHeight)
    ) {
      pipeline = pipeline.resize({
        width: maxWidth,
        height: maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    const out = await pipeline
      .webp({
        quality,
        effort: 5,
        smartSubsample: true,
      })
      .toBuffer();

    return {
      buffer: out,
      ext: ".webp",
      mime: "image/webp",
      converted: true,
    };
  } catch (error) {
    console.warn("WebP conversion skipped:", error.message);
    const ext = ".jpg";
    return { buffer, ext, mime: "image/jpeg", converted: false };
  }
}

export function uniqueMediaFilename(prefix = "img", ext = ".webp") {
  const id = crypto.randomBytes(4).toString("hex");
  return `${prefix}-${Date.now()}-${id}${ext}`;
}

export function ensureWebpFilename(originalName = "image.jpg") {
  const base = path
    .basename(originalName, path.extname(originalName))
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .slice(0, 40) || "image";
  return uniqueMediaFilename(base, ".webp");
}
