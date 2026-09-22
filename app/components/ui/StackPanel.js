"use client";

/**
 * Sticky stack panel — next section slides over this one (desktop).
 * Exact 100vh on lg so one-scroll snap lands on a full screen (no half bleed).
 */
export default function StackPanel({
  children,
  z = 1,
  id,
  className = "",
  as: Tag = "section",
  sticky = true,
  ...rest
}) {
  return (
    <Tag
      id={id}
      className={[
        sticky
          ? "relative min-h-[85dvh] lg:sticky lg:top-0 lg:h-screen lg:min-h-screen lg:max-h-screen"
          : "relative min-h-[85dvh] lg:h-screen lg:min-h-screen lg:max-h-screen",
        "w-full overflow-hidden",
        className,
      ].join(" ")}
      style={{ zIndex: z }}
      data-stack-panel=""
      {...rest}
    >
      {children}
    </Tag>
  );
}
