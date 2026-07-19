import type { UIKitSizeValue } from "../../frameworks/shared/sizing";
import type { RadiusProps } from "../../frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../frameworks/Theme/Theme.types";
import type { TextProps } from "../Text/Text.types";

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
