import type { Editor } from "@tiptap/react";
import type { CSSProperties } from "react";
import type {
  ThemeBackgroundPaint,
  ThemeBorderPaint,
} from "../../Frameworks/Theme/Theme.types";

export type TiptapToolbarItem =
  | "bold"
  | "italic"
  | "strike"
  | "code"
  | "h1"
  | "h2"
  | "h3"
  | "bulletList"
  | "orderedList"
  | "blockquote"
  | "codeBlock"
  | "link"
  | "image"
  | "undo"
  | "redo"
  | "divider";

export interface TiptapProps {
  value?: string;
  defaultValue?: string;
  onChange?: (markdown: string) => void;
  onUpdate?: (editor: Editor) => void;
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
  toolbar?: TiptapToolbarItem[] | false;
  themePreset?:
    | "UIPrimary"
    | "UISecondary"
    | "ReversedUIPrimary"
    | "ReversedUISecondary";
  background?: ThemeBackgroundPaint;
  border?: ThemeBorderPaint;
  radius?:
    | "None"
    | "Light"
    | "Regular"
    | "Bold"
    | "ExtraBold"
    | "Heavy"
    | "Circle";
  className?: string;
  style?: CSSProperties;
  "data-color-mode"?: "light" | "dark";
}
