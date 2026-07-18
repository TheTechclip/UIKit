import View from "../../Frameworks/View/View";
import type { SkeletonProps } from "./Skeleton.types";

export default function Skeleton({
  className,
  style,
  width,
  height,
  count,
  type,
  "data-color-mode": dataTheme,
}: SkeletonProps) {
  const autoHeight = type ? `var(--font-${type.toLowerCase()}-size)` : height;
  const slots = Array.from({ length: count || 1 }, (_, index) => index + 1);

  return slots.map((slot) => (
    <View
      key={`skeleton-${slot}`}
      data-color-mode={dataTheme}
      className={className}
      width={width || "100%"}
      height={autoHeight}
      style={{
        ...style,
        background:
          "color-mix(in srgb, var(--color-base-light-2) 65%, transparent)",
      }}
    />
  ));
}
