import { Size } from "../../frameworks/shared/sizing";
import type { DividerProps } from "./Divider.types";

export default function Divider({
  vertical = false,
  margin,
  marginHorizontal,
  marginVertical,
  gradient = false,
  className,
  style,
  "data-color-mode": dataTheme,
}: DividerProps) {
  const resolvedMargin = Size(margin);
  const resolvedVertical = Size(marginVertical);
  const resolvedHorizontal = Size(marginHorizontal);

  const computedStyle = {
    display: "block",
    border: "none",
    margin: 0,
    borderRadius: "var(--radius-circle)",
    width: vertical ? ".15rem" : "100%",
    height: vertical ? undefined : ".1rem",
    alignSelf: vertical ? "stretch" : undefined,
    flex: vertical ? "0 0 auto" : undefined,
    minHeight: vertical ? "1.8rem" : undefined,
    background: gradient
      ? `linear-gradient(${vertical ? "180deg" : "90deg"}, transparent 0%, color-mix(in srgb, var(--color-base-reversed-6) 10%, transparent) 50%, transparent 100%)`
      : "color-mix(in srgb, var(--color-base-reversed-6) 10%, transparent)",
    marginTop: resolvedVertical ?? resolvedMargin,
    marginBottom: resolvedVertical ?? resolvedMargin,
    marginLeft: resolvedHorizontal ?? resolvedMargin,
    marginRight: resolvedHorizontal ?? resolvedMargin,
    ...style,
  } as React.CSSProperties;

  return (
    <hr
      aria-orientation={vertical ? "vertical" : undefined}
      data-color-mode={dataTheme}
      className={className}
      style={computedStyle}
    />
  );
}
