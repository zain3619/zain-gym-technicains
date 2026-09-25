"use client";

import { useEffect, useState } from "react";
import { resolveLocalMedia } from "../../lib/localMedia";

function isRemote(src) {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

function preferWebp(src) {
  if (!src || typeof src !== "string") return src;
  if (isRemote(src)) return src;
  if (/\.png$/i.test(src)) return src.replace(/\.png$/i, ".webp");
  return src;
}

function cloudinaryOptimize(src, width = 1600) {
  if (!src || !src.includes("res.cloudinary.com")) return src;
  const marker = "/upload/";
  const at = src.indexOf(marker);
  if (at === -1) return src;
  const after = src.slice(at + marker.length);
  if (after.startsWith("f_auto") || after.includes("f_auto,")) return src;
  return `${src.slice(0, at + marker.length)}f_auto,q_auto:good,c_limit,w_${width},dpr_auto/${after}`;
}

/**
 * Plain <img> for reliability (local media + Cloudinary).
 * Avoids Next/Image blank frames on fill layouts.
 */
export default function MediaImage({
  src,
  alt = "",
  fill = false,
  width,
  height,
  className = "",
  priority = false,
  fallback = "",
  style,
}) {
  const primary = cloudinaryOptimize(
    preferWebp(resolveLocalMedia(src)),
    fill ? 1600 : width || 1200
  );
  const secondary = cloudinaryOptimize(
    preferWebp(resolveLocalMedia(fallback)),
    1000
  );

  const [currentSrc, setCurrentSrc] = useState(primary || secondary);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setCurrentSrc(primary || secondary);
  }, [primary, secondary]);

  const handleError = () => {
    if (!failed && secondary && secondary !== currentSrc) {
      setFailed(true);
      setCurrentSrc(secondary);
      return;
    }
    // Last resort: original remote without local map
    if (!failed && src && src !== currentSrc) {
      setFailed(true);
      setCurrentSrc(cloudinaryOptimize(src, 1400));
    }
  };

  const resolved = currentSrc || secondary;
  if (!resolved) return null;

  const wantsContain =
    typeof className === "string" && className.includes("object-contain");

  const imgStyle = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: wantsContain ? "contain" : "cover",
        objectPosition: className?.includes("object-top")
          ? "top center"
          : "center",
        ...style,
      }
    : style;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      width={fill ? undefined : width || 1200}
      height={fill ? undefined : height || 800}
      className={className}
      style={imgStyle}
      onError={handleError}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      referrerPolicy={isRemote(resolved) ? "no-referrer" : undefined}
    />
  );
}
