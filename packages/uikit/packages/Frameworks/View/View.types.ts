import type { MotionProps } from "motion/react";
import type { CSSProperties, HTMLAttributes } from "react";
import type { PaddingProps } from "../_shared/Padding.types";
import type { UIKitSizeValue } from "../_shared/sizing";
import type { WindProps } from "../_shared/Wind.types";
import type { RadiusProps } from "../Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../Theme/Theme.types";

export interface ViewProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "color">,
    ThemeSystemProps,
    BorderProps,
    RadiusProps,
    PaddingProps,
    WindProps {
  "data-color-mode"?: string;
  motion?: MotionProps;
  wrap?: CSSProperties["flexWrap"];
  order?: CSSProperties["order"];

  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridAutoFlow?: CSSProperties["gridAutoFlow"];

  inline?: boolean;

  mobileStrict?: boolean;
  mobileOrder?: number;

  sticky?: boolean | UIKitSizeValue;
  top?: UIKitSizeValue;
  bottom?: UIKitSizeValue;
}
