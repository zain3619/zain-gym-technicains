"use client";

import SmoothScroll from "./SmoothScroll";
import CustomCursor from "./CustomCursor";

export default function ExperienceProviders({ children }) {
  return (
    <SmoothScroll>
      <CustomCursor />
      {children}
    </SmoothScroll>
  );
}
