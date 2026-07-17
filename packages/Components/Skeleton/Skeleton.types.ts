import type { TextProps } from "@/packages/Components/Text/Text.types";
import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";

export interface SkeletonProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: UIKitSizeValue;
  height?: UIKitSizeValue;
  count?: number;
  type?: TextProps["type"];
}
