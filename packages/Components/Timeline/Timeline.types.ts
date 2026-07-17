import type { IconProps } from "@/packages/Components/Icon/Icon.types";
import type { PressableProps } from "@/packages/Frameworks/Pressable/Pressable.types";
import type { ThemeSystemProps } from "@/packages/Frameworks/Theme/Theme.types";

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
