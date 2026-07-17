import type { TextProps } from "@/packages/Components/Text/Text.types";
import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";
import type { RadiusProps } from "@/packages/Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "@/packages/Frameworks/Theme/Theme.types";

export interface CheckboxProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "size" | "title" | "color"
    >,
    BorderProps,
    RadiusProps,
    ThemeSystemProps {
  "data-color-mode"?: string;
  title?: React.ReactNode;
  titleType?: TextProps["type"];
  titleSpaceBetween?: boolean;
  reversed?: boolean;
  readOnly?: boolean;
  size?: UIKitSizeValue;
}
