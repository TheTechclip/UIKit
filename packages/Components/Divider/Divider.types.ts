import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";

export interface DividerProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  vertical?: boolean;
  margin?: UIKitSizeValue;
  marginHorizontal?: UIKitSizeValue;
  marginVertical?: UIKitSizeValue;
  gradient?: boolean;
}
