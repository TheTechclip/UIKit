import type { PressableProps } from "../../frameworks/Pressable/Pressable.types";
import type { UIKitSizeValue } from "../../frameworks/shared/sizing";
import type { RadiusProps } from "../../frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../frameworks/Theme/Theme.types";
import type { IconProps } from "../Icon/Icon.types";
import type { TextProps } from "../Text/Text.types";

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
