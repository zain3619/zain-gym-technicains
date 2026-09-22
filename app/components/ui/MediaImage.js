"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

function isRemote(src) {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

/** Cloudinary delivery transforms for faster loads */
function optimizeSrc(src, width = 1600) {
  if (!src || typeof src !== "string") return src;
  if (!src.includes("res.cloudinary.com")) return src;
  const marker = "/upload/";
  const at = src.indexOf(marker);
  if (at === -1) return src;
  const after = src.slice(at + marker.length);
  if (after.startsWith("f_auto") || after.includes("f_auto,")) return src;
  return `${src.slice(0, at + marker.length)}f_auto,q_auto:good,c_limit,w_${width}/${after}`;
}

/**
 * Reliable media helper:
 * - local paths + remote URLs
 * - Cloudinary auto format/quality
 * - onError falls back only if a fallback src is provided
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
  unoptimized = true,
  loading,
}) {
  const optimized = optimizeSrc(src, fill ? 1600 : width || 1200);
  const optimizedFallback = optimizeSrc(fallback, fill ? 1200 : width || 800);
  const [currentSrc, setCurrentSrc] = useState(optimized || optimizedFallback);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
    setCurrentSrc(optimized || optimizedFallback);
  }, [optimized, optimizedFallback]);

  const handleError = () => {
    if (!failed && optimizedFallback && optimizedFallback !== currentSrc) {
      setFailed(true);
      setCurrentSrc(optimizedFallback);
    }
  };

  const resolved = currentSrc || optimizedFallback;
  if (!resolved) return null;

  const remote = isRemote(resolved);
  const loadMode = loading || (priority ? "eager" : "lazy");

  if (fill) {
    if (remote || unoptimized) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolved}
          alt={alt}
          onError={handleError}
          className={className}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            ...style,
          }}
          loading={loadMode}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          referrerPolicy={remote ? "no-referrer" : undefined}
        />
      );
    }

    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        sizes={sizes || "100vw"}
        priority={priority}
        className={className}
        style={style}
        onError={handleError}
      />
    );
  }

  if (remote || unoptimized) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt}
        width={width}
        height={height}
        onError={handleError}
        className={className}
        style={style}
        loading={loadMode}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        referrerPolicy={remote ? "no-referrer" : undefined}
      />
    );
  }

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width || 1200}
      height={height || 800}
      priority={priority}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}
