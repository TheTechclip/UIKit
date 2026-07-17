import type { TextProps } from "@/packages/Components/Text/Text.types";
import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";
import type { ThemeSystemProps } from "@/packages/Frameworks/Theme/Theme.types";

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
