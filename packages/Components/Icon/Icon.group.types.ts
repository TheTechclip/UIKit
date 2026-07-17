import type { IconProps } from "@/packages/Components/Icon/Icon.types";
import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";
import type { RadiusProps } from "@/packages/Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "@/packages/Frameworks/Theme/Theme.types";

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
