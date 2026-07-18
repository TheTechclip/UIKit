import type { UIKitSizeValue } from "../../Frameworks/_shared/sizing";
import type { RadiusProps } from "../../Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../Frameworks/Theme/Theme.types";
import type { TextProps } from "../Text/Text.types";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "color">,
    BorderProps,
    RadiusProps,
    ThemeSystemProps {
  title?: string;
  titleType?: TextProps["type"];
  titleSpaceBetween?: boolean;
  reversed?: boolean;
  readOnly?: boolean;
  size?: UIKitSizeValue;
}
