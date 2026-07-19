import clsx from "clsx";
import type { CSSProperties } from "react";
import { Size } from "../../frameworks/shared/sizing";
import { resolveThemeClasses } from "../../frameworks/Theme/Theme.types";
import View from "../../frameworks/View/View";
import styles from "./Spinner.module.scss";
import type { SpinnerProps } from "./Spinner.types";

const SPINNER_SEGMENTS = 12;
const SPINNER_VISUAL_SCALE_BY_TYPE = {
  apple: 0.78,
  material: 0.82,
  wheel: 0.86,
} as const;

export default function Spinner({
  type,
  className,
  style,
  size,
  color,
  opacity,
  duration,
  strokeWidth,
  linecap,
  role,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  "data-color-mode": dataTheme,
}: SpinnerProps) {
  const resolvedType = type ?? "wheel";
  const resolvedSize = Size(size) ?? "1.8rem";
  const resolvedStrokeWidth = strokeWidth || 2.4;
  const resolvedDuration = duration || 1;
  const resolvedVisualScale =
    SPINNER_VISUAL_SCALE_BY_TYPE[resolvedType] ?? 0.86;
  const resolvedAriaHidden =
    ariaHidden ?? (role || ariaLabel ? undefined : true);
  const themeClasses = resolveThemeClasses({ color: color ?? "Base1" });
  const spinnerStyle = {
    "--spinner-duration": `${resolvedDuration}s`,
    "--spinner-size": `calc(${resolvedSize} * ${resolvedVisualScale})`,
    "--spinner-segment-width": resolvedStrokeWidth,
    opacity,
  } as CSSProperties;

  if (resolvedType === "material") {
    const radius = 25 - resolvedStrokeWidth;
    const circumference = 2 * Math.PI * radius;

    return (
      <svg
        {...({ "data-color-mode": dataTheme } as Record<
          string,
          string | undefined
        >)}
        className={clsx(styles.MaterialSpinner, ...themeClasses, className)}
        viewBox="0 0 50 50"
        role={role}
        aria-hidden={resolvedAriaHidden}
        aria-label={ariaLabel}
        style={{ ...spinnerStyle, ...style }}
      >
        <circle
          className={styles.MaterialTrack}
          fill="none"
          strokeWidth={resolvedStrokeWidth}
          strokeLinecap={linecap || "round"}
          cx="25"
          cy="25"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.75}
        />
      </svg>
    );
  } else if (resolvedType === "apple") {
    const segmentKeys = Array.from(
      { length: SPINNER_SEGMENTS },
      (_, index) => `spinner-segment-${index}`,
    );

    return (
      <svg
        {...({ "data-color-mode": dataTheme } as Record<
          string,
          string | undefined
        >)}
        className={clsx(styles.Spinner, ...themeClasses, className)}
        viewBox="0 0 24 24"
        role={role}
        aria-hidden={resolvedAriaHidden}
        aria-label={ariaLabel}
        style={{ ...spinnerStyle, ...style }}
      >
        {segmentKeys.map((key, index) => (
          <line
            key={key}
            className={styles.Segment}
            x1="12"
            y1="1.5"
            x2="12"
            y2="6.75"
            strokeLinecap={linecap || "round"}
            transform={`rotate(${index * (360 / SPINNER_SEGMENTS)} 12 12)`}
            style={{
              opacity: (index + 1) / SPINNER_SEGMENTS,
            }}
          />
        ))}
      </svg>
    );
  } else {
    return (
      <View
        data-color-mode={dataTheme}
        role={role || "progressbar"}
        aria-hidden={resolvedAriaHidden}
        aria-label={ariaLabel}
        className={clsx(styles.WheelSpinner, ...themeClasses, className)}
        style={{ ...spinnerStyle, ...style }}
      />
    );
  }
}
