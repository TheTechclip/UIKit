import type { AriaRole, CSSProperties, SVGAttributes } from "react";
import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";
import type { ThemePaint } from "@/packages/Frameworks/Theme/Theme.types";

export interface SpinnerProps {
  "data-color-mode"?: string;
  "aria-hidden"?: boolean | "true" | "false";
  "aria-label"?: string;
  role?: AriaRole;
  type?: "apple" | "material" | "wheel";
  className?: string;
  style?: CSSProperties;
  size?: UIKitSizeValue;
  strokeWidth?: number;
  color?: ThemePaint;
  opacity?: number;
  duration?: number;
  linecap?: SVGAttributes<SVGElement>["strokeLinecap"];
}
