import type { CSSProperties } from "react";
import type { RadiusProps } from "@/packages/Frameworks/Theme/Radius.types";
import type {
  ThemeBackgroundPaint,
  ThemePaint,
} from "@/packages/Frameworks/Theme/Theme.types";

export interface ProgressProps extends RadiusProps {
  "data-color-mode"?: string;
  "aria-hidden"?: boolean;
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
  value?: number;
  min?: number;
  max?: number;
  indeterminate?: boolean;
  background?: ThemeBackgroundPaint;
  color?: ThemePaint;
  trackClassName?: string;
  indicatorClassName?: string;
}
