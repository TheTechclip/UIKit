import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { UIKitSizeValue } from "../../_shared/sizing";
import type { ViewProps } from "../View.types";

export type HScrollViewViewport = "w1" | "w2" | "w3" | "w4";
export type HScrollViewActive = boolean | HScrollViewViewport;
export type HScrollViewControls = {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  isScrollActive: boolean;
};

export interface HScrollViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color"> {
  active?: HScrollViewActive;
  children?: ReactNode;
  rootStyle?: CSSProperties;
  containerStyle?: CSSProperties;
  activeContainerStyle?: CSSProperties;
  inactiveContainerStyle?: CSSProperties;
  itemWidth?: UIKitSizeValue;
  itemHeight?: UIKitSizeValue;
  renderControls?: (controls: HScrollViewControls) => ReactNode;
  showEdgeEffect?: boolean;
  width?: UIKitSizeValue;
  height?: UIKitSizeValue;
  padding?: UIKitSizeValue;
  margin?: UIKitSizeValue;

  alignItems?: ViewProps["alignItems"];
  justifyContent?: ViewProps["justifyContent"];
  wrap?: ViewProps["wrap"];
  gap?: ViewProps["gap"];
  fullWidth?: ViewProps["fullWidth"];
  background?: ViewProps["background"];
  color?: ViewProps["color"];
  themePreset?: ViewProps["themePreset"];
  themeInteractive?: ViewProps["themeInteractive"];
  selected?: ViewProps["selected"];
  border?: ViewProps["border"];
  radius?: ViewProps["radius"];
  backgroundBlur?: ViewProps["backgroundBlur"];
  "data-color-mode"?: ViewProps["data-color-mode"];
}
