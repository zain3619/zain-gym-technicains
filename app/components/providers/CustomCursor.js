"use client";

import { useEffect, useRef, useState } from "react";

/** Custom cursor: fast dot + soft label ring (client-only to avoid extension hydration noise) */
export default function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const hover = useRef(false);
  const target = useRef({ x: -100, y: -100 });
  const labelPos = useRef({ x: -100, y: -100 });
  const raf = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return undefined;

    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!isFinePointer) return undefined;

    document.documentElement.classList.add("has-custom-cursor");
    if (rootRef.current) rootRef.current.style.opacity = "1";

    const onMove = (event) => {
      target.current.x = event.clientX;
      target.current.y = event.clientY;
      const scale = hover.current ? 0 : 1;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) scale(${scale})`;
      }
    };

    const onOver = (event) => {
      const interactive = event.target.closest?.(
        "a, button, [data-cursor], input, textarea, select, label"
      );
      if (!labelRef.current || !dotRef.current) return;

      if (interactive) {
        labelRef.current.textContent =
          interactive.getAttribute("data-cursor") || "VIEW";
        hover.current = true;
        labelRef.current.style.opacity = "1";
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) scale(0)`;
      } else {
        hover.current = false;
        labelRef.current.style.opacity = "0";
      }
    };

    const tick = () => {
      const lx = labelPos.current.x;
      const ly = labelPos.current.y;
      labelPos.current.x += (target.current.x - lx) * 0.35;
      labelPos.current.y += (target.current.y - ly) * 0.35;
      if (labelRef.current) {
        const s = hover.current ? 1 : 0.4;
        labelRef.current.style.transform = `translate3d(${labelPos.current.x}px, ${labelPos.current.y}px, 0) scale(${s})`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf.current);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      className="custom-cursor-root"
      aria-hidden
      style={{ opacity: 0 }}
      suppressHydrationWarning
    >
      <div ref={dotRef} className="cursor-dot" />
      <div ref={labelRef} className="cursor-label">
        VIEW
      </div>
    </div>
  );
}
