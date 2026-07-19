import type { PressableProps } from "../../frameworks/Pressable/Pressable.types";
import type { UIKitSizeValue } from "../../frameworks/shared/sizing";
import type { RadiusProps } from "../../frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../frameworks/Theme/Theme.types";
import type { IconProps } from "../Icon/Icon.types";
import type { TextProps } from "../Text/Text.types";

export interface PillProps extends ThemeSystemProps, RadiusProps, BorderProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  renderKey?: string;
  icon?: IconProps;
  pressable?: PressableProps;
  disabled?: boolean;
  text?: React.ReactNode;
  iconSize?: UIKitSizeValue;
  padding?: UIKitSizeValue;
  paddingHorizontal?: UIKitSizeValue;
  paddingVertical?: UIKitSizeValue;
  checkedThemePreset?: ThemeSystemProps["themePreset"];
  gap?: UIKitSizeValue;
  textType?: TextProps["type"];
  textSize?: TextProps["size"];
  textWeight?: TextProps["weight"];
  ellipsis?: boolean;
  rightIcon?: IconProps;
  loading?: boolean;
  shouldWrapText?: boolean;
}
