import type { RadiusProps } from "../../frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../frameworks/Theme/Theme.types";

export interface LabelProps extends ThemeSystemProps, BorderProps, RadiusProps {
  "data-color-mode"?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  htmlFor?: string;
  hintId?: string;
  title?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  cursor?: React.CSSProperties["cursor"];
  hint?: {
    type: "info" | "error" | "warning" | "success";
    text: React.ReactNode;
  };
}

export type LabelSharedProps = Omit<
  LabelProps,
  "children" | "htmlFor" | "hintId"
>;
