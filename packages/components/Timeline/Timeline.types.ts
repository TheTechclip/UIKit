import type { PressableProps } from "../../frameworks/Pressable/Pressable.types";
import type { ThemeSystemProps } from "../../frameworks/Theme/Theme.types";
import type { IconProps } from "../Icon/Icon.types";

export interface TimelineItemProps {
  children?: React.ReactNode;
  id?: string | number;
  icon?: IconProps;
  node?: React.ReactNode;
  nodePreset?: ThemeSystemProps["themePreset"];
  nodeBackground?: ThemeSystemProps["background"];
  nodeColor?: ThemeSystemProps["color"];
  pressable?: PressableProps;
}

export interface TimelineProps {
  className?: string;
  style?: React.CSSProperties;
  items: TimelineItemProps[];
  nodePreset?: ThemeSystemProps["themePreset"];
  nodeBackground?: ThemeSystemProps["background"];
  nodeColor?: ThemeSystemProps["color"];
}
