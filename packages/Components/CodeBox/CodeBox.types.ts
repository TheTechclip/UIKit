import type { RadiusProps } from "@/packages/Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "@/packages/Frameworks/Theme/Theme.types";

export interface CodeBoxProps
  extends ThemeSystemProps,
    RadiusProps,
    BorderProps {
  "data-color-mode"?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  code: string;
  language?: string;
}
