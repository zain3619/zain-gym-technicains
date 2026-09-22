"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const labelRef = useRef(null);
  const hover = useRef(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!isFinePointer) return undefined;

    document.documentElement.classList.add("has-custom-cursor");
    if (dotRef.current) dotRef.current.style.opacity = "1";

    const place = (x, y) => {
      const scale = hover.current ? 0 : 1;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${
          hover.current ? 1 : 0.4
        })`;
      }
    };

    const onMove = (event) => {
      place(event.clientX, event.clientY);
    };

    const onOver = (event) => {
      const interactive = event.target.closest?.(
        "a, button, [data-cursor], input, textarea, select, label"
      );
      if (!labelRef.current || !dotRef.current) return;

      if (interactive) {
        const label = interactive.getAttribute("data-cursor") || "VIEW";
        labelRef.current.textContent = label;
        hover.current = true;
        labelRef.current.style.opacity = "1";
      } else {
        hover.current = false;
        labelRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        aria-hidden
        style={{ opacity: 0 }}
      />
      <div ref={labelRef} className="cursor-label" aria-hidden>
        VIEW
      </div>
    </>
  );
}
