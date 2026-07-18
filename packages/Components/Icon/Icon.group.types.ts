import type { UIKitSizeValue } from "../../Frameworks/_shared/sizing";
import type { RadiusProps } from "../../Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../Frameworks/Theme/Theme.types";
import type { IconProps } from "./Icon.types";

export interface IconGroupProps extends BorderProps, RadiusProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  icons?: IconProps | IconProps[];
  padding?: UIKitSizeValue;
  iconBoxOptions?: IconProps["boxOptions"];
  iconSize?: IconProps["size"];
  iconWidth?: IconProps["width"];
  iconHeight?: IconProps["height"];
  background?: ThemeSystemProps["background"];
}
