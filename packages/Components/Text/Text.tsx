import clsx from "clsx";
import styles from "@/packages/Components/Text/Text.module.scss";
import type { TextProps } from "@/packages/Components/Text/Text.types";
import { Size } from "@/packages/Frameworks/_shared/sizing";

export default function Text({
  children,
  type,
  color,
  textAlign,
  lineHeight,
  weight,
  letterSpacing,
  size,
  style,
  className,
  verticalTrim,
  fontType,
  id,
  opacity,
  "data-color-mode": dataColorMode,
}: TextProps) {
  return (
    <span
      id={id}
      data-color-mode={dataColorMode}
      className={clsx(
        styles.Text,
        type,
        fontType === "serif" ? "FontSerif" : fontType === "code" && "FontCode",
        className,
      )}
      style={{
        lineHeight: verticalTrim ? 1 : lineHeight,
        fontWeight: weight,
        letterSpacing: letterSpacing,
        fontSize: Size(size),
        color: color,
        opacity:
          opacity === undefined ? undefined : Math.max(0, Math.min(opacity, 1)),
        wordBreak: "break-word",
        textAlign: textAlign,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
