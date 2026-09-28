"use client";

import { useEffect, useRef, useState } from "react";
import { resolveLocalMedia } from "../../lib/localMedia";

function isRemote(src) {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

function preferWebp(src) {
  if (!src || typeof src !== "string") return src;
  if (isRemote(src)) return src;
  if (/\.png$/i.test(src)) return src.replace(/\.png$/i, ".webp");
  if (/\.jpe?g$/i.test(src)) return src.replace(/\.jpe?g$/i, ".webp");
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
 * Shows a shimmer skeleton until the image has loaded.
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
  skeleton = true,
}) {
  const imgRef = useRef(null);
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
    setCurrentSrc(primary || secondary);
  }, [primary, secondary]);

  // Cached images often skip onLoad — mark ready if already complete.
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return undefined;

    const mark = () => {
      if (img.complete && img.naturalWidth > 0) setLoaded(true);
    };
    mark();
    const t = window.setTimeout(mark, 50);
    return () => window.clearTimeout(t);
  }, [currentSrc]);

  const handleError = () => {
    if (!failed && secondary && secondary !== currentSrc) {
      setFailed(true);
      setLoaded(false);
      setCurrentSrc(secondary);
      return;
    }
    if (!failed && src && src !== currentSrc) {
      setFailed(true);
      setLoaded(false);
      setCurrentSrc(cloudinaryOptimize(src, 1400));
      return;
    }
    // Last resort: stop hiding forever
    setLoaded(true);
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
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.45s ease",
        ...style,
      }
    : {
        opacity: loaded ? 1 : 0,
        transition: "opacity 0.45s ease",
        ...style,
      };

  return (
    <>
      {skeleton && !loaded ? (
        <span
          aria-hidden
          className={
            fill
              ? "panel-skel-shine absolute inset-0 z-[1] bg-[#121212]"
              : "panel-skel-shine absolute inset-0 z-[1] block bg-[#121212]"
          }
          style={
            fill
              ? undefined
              : {
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                }
          }
        />
      ) : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={resolved}
        alt={alt}
        width={fill ? undefined : width || 1200}
        height={fill ? undefined : height || 800}
        className={className}
        style={imgStyle}
        onError={handleError}
        onLoad={() => setLoaded(true)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        referrerPolicy={isRemote(resolved) ? "no-referrer" : undefined}
      />
    </>
  );
}
