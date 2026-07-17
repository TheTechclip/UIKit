import type { UIKitSizeValue } from "../../Frameworks/_shared/sizing";

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
