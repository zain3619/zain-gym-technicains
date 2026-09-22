"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

function isRemote(src) {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

/**
 * Cloudinary: serve modern format + capped width from their CDN
 * (faster than shipping full originals through Vercel).
 */
function optimizeSrc(src, width = 1400) {
  if (!src || typeof src !== "string") return src;
  if (!src.includes("res.cloudinary.com")) return src;
  const marker = "/upload/";
  const at = src.indexOf(marker);
  if (at === -1) return src;
  const after = src.slice(at + marker.length);
  if (after.startsWith("f_auto") || after.includes("f_auto,")) return src;
  return `${src.slice(0, at + marker.length)}f_auto,q_auto:eco,c_limit,w_${width},dpr_auto/${after}`;
}

/** Prefer .webp when we generated a compressed twin for local assets */
function preferWebp(src) {
  if (!src || typeof src !== "string") return src;
  if (isRemote(src)) return src;
  if (/\.png$/i.test(src)) return src.replace(/\.png$/i, ".webp");
  return src;
}

/**
 * Fast media helper:
 * - Local → Next/Image (quality 75)
 * - Cloudinary → direct CDN <img> (already compressed, avoids Next quality warnings + hydration noise)
 */
export default function MediaImage({
  src,
  alt = "",
  fill = false,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  fallback = "",
  style,
}) {
  const targetWidth = fill ? 1400 : width || 1200;
  const primary = optimizeSrc(preferWebp(src), targetWidth);
  const secondary = optimizeSrc(
    preferWebp(fallback),
    Math.min(targetWidth, 1000)
  );

  const [currentSrc, setCurrentSrc] = useState(primary || secondary);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setCurrentSrc(primary || secondary);
  }, [primary, secondary]);

  const handleError = () => {
    if (
      !failed &&
      typeof currentSrc === "string" &&
      currentSrc.endsWith(".webp") &&
      typeof src === "string" &&
      src.endsWith(".png")
    ) {
      setFailed(true);
      setCurrentSrc(optimizeSrc(src, targetWidth));
      return;
    }
    if (!failed && secondary && secondary !== currentSrc) {
      setFailed(true);
      setCurrentSrc(secondary);
    }
  };

  const resolved = currentSrc || secondary;
  if (!resolved) return null;

  const useCdnImg =
    isRemote(resolved) && resolved.includes("res.cloudinary.com");

  // Pre-optimized CDN / already-transformed remote → plain img (stable SSR)
  if (useCdnImg) {
    const imgStyle = fill
      ? {
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          ...style,
        }
      : style;

    // Honor object-contain from className for equipment shots
    if (fill && typeof className === "string" && className.includes("object-contain")) {
      imgStyle.objectFit = "contain";
    }

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
        referrerPolicy="no-referrer"
      />
    );
  }

  // Local + other remotes → Next Image (configured quality 75)
  if (fill) {
    return (
      <Image
        key={resolved}
        src={resolved}
        alt={alt}
        fill
        sizes={
          sizes ||
          "(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1400px"
        }
        className={className}
        style={style}
        onError={handleError}
        quality={75}
        {...(priority ? { priority: true } : {})}
      />
    );
  }

  return (
    <Image
      key={resolved}
      src={resolved}
      alt={alt}
      width={width || 1200}
      height={height || 800}
      sizes={sizes}
      className={className}
      style={style}
      onError={handleError}
      quality={75}
      {...(priority ? { priority: true } : {})}
    />
  );
}
