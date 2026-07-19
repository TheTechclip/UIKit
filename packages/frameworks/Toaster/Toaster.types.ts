import type { ToasterProps } from "sonner";
import type { IconProps } from "../../components/Icon/Icon.types";

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
