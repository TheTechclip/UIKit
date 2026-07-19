import type { UIKitSizeValue } from "../../frameworks/shared/sizing";
import type { ThemeSystemProps } from "../../frameworks/Theme/Theme.types";
import type { TextProps } from "../Text/Text.types";

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "color">,
    ThemeSystemProps {
  title?: string;
  titleType?: TextProps["type"];
  titleSpaceBetween?: boolean;
  reversed?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  size?: UIKitSizeValue;
  width?: UIKitSizeValue;
  height?: UIKitSizeValue;
}
