import type { PressableProps } from "../../frameworks/Pressable/Pressable.types";
import type { UIKitSizeValue } from "../../frameworks/shared/sizing";
import type { RadiusProps } from "../../frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../frameworks/Theme/Theme.types";
import type { DividerProps } from "../Divider/Divider.types";
import type { IconProps } from "../Icon/Icon.types";
import type { TitleProps } from "../Title/Title.types";

export interface BoxProps extends ThemeSystemProps, RadiusProps, BorderProps {
  "data-color-mode"?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface BoxContentProps {
  "data-color-mode"?: string;
  children?: React.ReactNode;
  title?: React.ReactNode;
  titleSize?: TitleProps["titleType"];
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  icon?: IconProps;
  loading?: boolean;
  titleCustom?: React.ReactNode;
  card?: boolean;
  padding?: UIKitSizeValue;
  paddingHorizontal?: UIKitSizeValue;
  paddingVertical?: UIKitSizeValue;
}

export interface BoxFooterProps
  extends ThemeSystemProps,
    BorderProps,
    RadiusProps {
  "data-color-mode"?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: React.ReactNode;
  titleSize?: TitleProps["titleType"];
  icon?: IconProps;
  pressable?: PressableProps;
  divider?: DividerProps;
}
