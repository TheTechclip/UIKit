import type { MotionProps } from "motion/react";
import type { ElementType, HTMLAttributes } from "react";
import type { RadiusValue } from "../Theme/Radius.types";

export interface SquircleProps
  extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  as?: ElementType;
  radius?: RadiusValue;
  cornerRadius?: number;
  cornerSmoothing?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  preserveSmoothing?: boolean;
  motion?: MotionProps;
}
