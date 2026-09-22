"use client";

/**
 * Sticky stack panel — next section slides over this one (desktop).
 * Fixed 100dvh height so one-scroll = one screen snaps cleanly.
 * On mobile/tablet: normal flow to avoid scroll hang.
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
          ? "relative min-h-[85dvh] lg:sticky lg:top-0 lg:h-[100dvh] lg:min-h-[100dvh]"
          : "relative min-h-[85dvh] lg:h-[100dvh] lg:min-h-[100dvh]",
        "w-full overflow-hidden",
        "lg:snap-start lg:snap-always",
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
