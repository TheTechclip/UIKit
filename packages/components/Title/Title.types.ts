import type { PressableProps } from "../../frameworks/Pressable/Pressable.types";
import type { ViewProps } from "../../frameworks/View/View.types";
import type { IconGroupProps } from "../Icon/Icon.group.types";
import type { IconProps } from "../Icon/Icon.types";
import type { PillProps } from "../Pill/Pill.types";
import type { TextProps } from "../Text/Text.types";

interface TitleItemProps {
  "data-color-mode"?: string;
  text?: React.ReactNode;
  active?: boolean;
  pressable?: PressableProps;
}

export interface TitleProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: TitleItemProps[] | TitleItemProps;
  titleType?: TextProps["type"];
  titleClassName?: TextProps["className"];
  titleGap?: ViewProps["gap"];
  leftGap?: ViewProps["gap"];
  rightGap?: ViewProps["gap"];
  fontType?: TextProps["fontType"];
  titleLineHeight?: number;
  titleVerticalTrim?: boolean;
  suffix?: PillProps;
  meta?: React.ReactNode;
  actions?: IconGroupProps["icons"];
  caption?: React.ReactNode;
  captionOpacity?: TextProps["opacity"];
  context?: React.ReactNode;
}

export type TitleContextItem = Pick<
  PressableProps,
  | "className"
  | "style"
  | "themePreset"
  | "background"
  | "color"
  | "themeInteractive"
  | "selected"
  | "border"
  | "data-color-mode"
> & {
  key?: React.Key;
  content: React.ReactNode;
  leadingIcon?: IconProps["icon"];
  trailingIcon?: IconProps["icon"];
  leadingIconProps?: Omit<IconProps, "icon" | "pressable">;
  trailingIconProps?: Omit<IconProps, "icon" | "pressable">;
  pressable?: PressableProps;
};

export interface TitleContextProps {
  className?: string;
  style?: React.CSSProperties;
  start?: TitleContextItem | TitleContextItem[];
  end?: TitleContextItem | TitleContextItem[];
  startGap?: ViewProps["gap"];
  endGap?: ViewProps["gap"];
}
