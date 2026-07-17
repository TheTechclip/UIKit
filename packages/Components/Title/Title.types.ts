import type { IconGroupProps } from "@/packages/Components/Icon/Icon.group.types";
import type { IconProps } from "@/packages/Components/Icon/Icon.types";
import type { PillProps } from "@/packages/Components/Pill/Pill.types";
import type { TextProps } from "@/packages/Components/Text/Text.types";
import type { PressableProps } from "@/packages/Frameworks/Pressable/Pressable.types";
import type { ViewProps } from "@/packages/Frameworks/View/View.types";

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
