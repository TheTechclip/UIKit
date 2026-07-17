import type { CSSProperties } from "react";
import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";

export interface WindProps {
  width?: UIKitSizeValue;
  height?: UIKitSizeValue;
  margin?: UIKitSizeValue;
  gap?: UIKitSizeValue;
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  alignSelf?: CSSProperties["alignSelf"];
  column?: boolean;
  row?: boolean;
  fullWidth?: boolean;
  opacity?: CSSProperties["opacity"];
  noSquircle?: boolean;
}
