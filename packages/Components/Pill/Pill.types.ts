import type { IconProps } from "@/packages/Components/Icon/Icon.types";
import type { TextProps } from "@/packages/Components/Text/Text.types";
import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";
import type { PressableProps } from "@/packages/Frameworks/Pressable/Pressable.types";
import type { RadiusProps } from "@/packages/Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "@/packages/Frameworks/Theme/Theme.types";

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
