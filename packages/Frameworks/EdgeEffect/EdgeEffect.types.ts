import type { ViewProps } from "@/packages/Frameworks/View/View.types";

export interface EdgeEffectProps extends Omit<ViewProps, "children"> {
  side?: "left" | "right" | "top" | "bottom";
}
