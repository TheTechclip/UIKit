import clsx from "clsx";
import type { CSSProperties } from "react";
import { resolveThemeClasses } from "../../frameworks/Theme/Theme.types";
import View from "../../frameworks/View/View";
import Spinner from "../Spinner/Spinner";
import styles from "./Progress.module.scss";
import type { ProgressProps } from "./Progress.types";

function clampValue(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function resolveProgressPercent(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return ((clampValue(value, min, max) - min) / (max - min)) * 100;
}

export default function Progress({
  value = 0,
  min = 0,
  max = 100,
  indeterminate,
  className,
  style,
  "data-color-mode": dataTheme,
  "aria-hidden": ariaHidden,
  "aria-label": ariaLabel,
  background,
  color,
  trackClassName,
  indicatorClassName,
  radius,
}: ProgressProps) {
  if (indeterminate) {
    return (
      <Spinner
        data-color-mode={dataTheme}
        aria-hidden={ariaHidden}
        aria-label={ariaLabel}
        className={className}
        style={style}
      />
    );
  } else {
    const resolvedValue = clampValue(value, min, max);
    const resolvedPercent = resolveProgressPercent(resolvedValue, min, max);
    const trackStyle = {
      "--progress-percent": `${resolvedPercent}%`,
    } as CSSProperties;
    const trackThemeClasses = resolveThemeClasses({
      background: background ?? "Base6TP6",
    });
    const indicatorThemeClasses = resolveThemeClasses({
      color: color ?? "Base1",
    });

    return (
      <View
        data-color-mode={dataTheme}
        role="progressbar"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={resolvedValue}
        className={className}
        style={style}
        radius={radius ?? "Circle"}
        fullWidth
      >
        <View
          className={clsx(...trackThemeClasses, trackClassName)}
          style={{ position: "relative", overflow: "hidden", ...trackStyle }}
          radius={radius ?? "Circle"}
          height={10}
          fullWidth
        >
          <View
            className={clsx(
              styles.Indicator,
              ...indicatorThemeClasses,
              indicatorClassName,
            )}
            radius={radius ?? "Circle"}
          />
        </View>
      </View>
    );
  }
}
