"use client";

import { useRef } from "react";

export default function MagneticButton({
  children,
  className = "",
  strength = 0.28,
  as: Component = "a",
  ...props
}) {
  const ref = useRef(null);

  const onMove = (event) => {
    if (window.matchMedia("(hover: none)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate3d(${x * strength}px, ${y * strength}px, 0)`;
  };

  const onLeave = () => {
    if (ref.current) {
      ref.current.style.transform = "translate3d(0,0,0)";
    }
  };

  return (
    <Component
      ref={ref}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 0.08s linear", willChange: "transform" }}
      {...props}
    >
      {children}
    </Component>
  );
}
