import type { RadiusProps } from "../../frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../frameworks/Theme/Theme.types";

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
