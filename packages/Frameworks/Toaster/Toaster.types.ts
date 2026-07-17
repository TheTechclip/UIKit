import type { ToasterProps } from "sonner";
import type { IconProps } from "@/packages/Components/Icon/Icon.types";

export type { ToasterProps };

export interface ToasterBootstrapProps extends ToasterProps {
  "data-color-mode"?: string;
  theme?: ToasterProps["theme"];
  icon?: IconProps;
  title?: React.ReactNode;
  storage?: {
    key?: string;
    value?: string;
  }[];
}
