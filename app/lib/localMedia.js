import mediaMap from "./media-map.json";

function publicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("res.cloudinary.com")) return null;
  const m = url.match(/\/upload\/(?:[^/]+\/)*?(v\d+\/.+)$/);
  if (!m) return null;
  return m[1].replace(/\.(png|jpe?g|webp|gif)$/i, "");
}

function fileKeyFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  const m = url.match(/\/(gallery|team|about|testimonials?)\/([^.\/?#]+)/i);
  if (!m) return null;
  return `${m[1].toLowerCase()}/${m[2]}`;
}

/**
 * Prefer bundled /public/media assets over live Cloudinary fetches.
 */
export function resolveLocalMedia(src) {
  if (!src || typeof src !== "string") return src;
  if (src.startsWith("/") || src.startsWith("data:")) return src;

  if (mediaMap.byUrl?.[src]) return mediaMap.byUrl[src];

  const id = publicIdFromUrl(src);
  if (id && mediaMap.byId?.[id]) return mediaMap.byId[id];

  // Match without version: team/x0mzd1... → find byId ending
  const fileKey = fileKeyFromUrl(src);
  if (fileKey && mediaMap.byId) {
    const hit = Object.entries(mediaMap.byId).find(([k]) =>
      k.endsWith(`/${fileKey.split("/")[1]}`) || k.includes(`/${fileKey}`)
    );
    if (hit) return hit[1];
  }

  const stripped = src.replace(/\/upload\/(?!v\d)[^/]+\//, "/upload/");
  if (stripped !== src && mediaMap.byUrl?.[stripped]) {
    return mediaMap.byUrl[stripped];
  }

  return src;
}
