import type { ReactNode } from "react";
import type { IconProps } from "../Icon/Icon.types";
import type { TextProps } from "../Text/Text.types";
import type { UIKitSizeValue } from "../../Frameworks/_shared/sizing";
import type { PressableProps } from "../../Frameworks/Pressable/Pressable.types";
import type { RadiusProps } from "../../Frameworks/Theme/Radius.types";

export interface NavOption extends Omit<PressableProps, "title"> {
  checked?: boolean;
  icon?: IconProps;
  title?: ReactNode;
}

export interface NavProps extends RadiusProps {
  className?: string;
  style?: React.CSSProperties;
  "data-color-mode"?: string;
  name?: string;
  padding?: UIKitSizeValue;
  paddingHorizontal?: UIKitSizeValue;
  paddingVertical?: UIKitSizeValue;
  sizeFull?: boolean;
  radio?: boolean;
  dragSelection?: boolean;
  dragSelectionCommit?: "change" | "end";
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  titleType?: TextProps["type"];
  titleSize?: TextProps["size"];
  items: NavOption[];
}
