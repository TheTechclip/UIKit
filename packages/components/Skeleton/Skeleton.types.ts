import type { UIKitSizeValue } from "../../frameworks/shared/sizing";
import type { TextProps } from "../Text/Text.types";

export interface SkeletonProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: UIKitSizeValue;
  height?: UIKitSizeValue;
  count?: number;
  type?: TextProps["type"];
}
