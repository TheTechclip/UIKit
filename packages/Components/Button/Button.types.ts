import type { IconProps } from "@/packages/Components/Icon/Icon.types";
import type { TextProps } from "@/packages/Components/Text/Text.types";
import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";
import type { PressableProps } from "@/packages/Frameworks/Pressable/Pressable.types";
import type { RadiusProps } from "@/packages/Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "@/packages/Frameworks/Theme/Theme.types";

export type ButtonIconEndProps = Pick<
  IconProps,
  "icon" | "pressable" | "size" | "svg"
>;

export interface ButtonProps
  extends ThemeSystemProps,
    RadiusProps,
    BorderProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  icon?: IconProps;
  pressable?: PressableProps;
  textType?: TextProps["type"];
  sizeFull?: boolean;
  promise?: {
    type: "loading" | "success" | "error";
    text?: React.ReactNode;
  };
  text?: React.ReactNode;
  column?: boolean;
  padding?: UIKitSizeValue;
  paddingHorizontal?: UIKitSizeValue;
  paddingVertical?: UIKitSizeValue;
  modal?: boolean;
  popover?: {
    text?: React.ReactNode;
    icon?: IconProps;
    pressable?: PressableProps;
  }[];
  iconEnd?: ButtonIconEndProps;
  reversed?: boolean;
}
