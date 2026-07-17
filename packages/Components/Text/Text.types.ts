import type { UIKitSizeValue } from "@/packages/Frameworks/_shared/sizing";
import type { ThemePaint } from "@/packages/Frameworks/Theme/Theme.types";

export interface TextProps {
  "data-color-mode"?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?:
    | "LargeTitle"
    | "Title1"
    | "Title2"
    | "Title3"
    | "Headline"
    | "Callout"
    | "Body"
    | "Subheadline"
    | "Footnote"
    | "Caption1"
    | "Caption2"
    | "Coding"
    | "Pre";
  color?: ThemePaint;
  lineHeight?: number;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  letterSpacing?: number;
  size?: UIKitSizeValue;
  verticalTrim?: boolean;
  fontType?: "serif" | "code";
  textAlign?: "left" | "center" | "right";
  id?: string;
  opacity?: number;
}
