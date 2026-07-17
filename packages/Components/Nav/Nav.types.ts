import type { ReactNode } from "react";
import type { IconProps } from "@/packages/Components/Icon/Icon.types";
import type { TextProps } from "@/packages/Components/Text/Text.types";
import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";
import type { PressableProps } from "@/packages/Frameworks/Pressable/Pressable.types";
import type { RadiusProps } from "@/packages/Frameworks/Theme/Radius.types";

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
