import type { RadiusValue } from "../../Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeBackgroundPaint,
  ThemePaint,
  ThemePreset,
} from "../../Frameworks/Theme/Theme.types";

export type TooltipPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end";

export interface TooltipProps extends BorderProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delay?: number;
  disabled?: boolean;
  interactive?: boolean;
  flip?: boolean;
  className?: string;
  contentClassName?: string;
  maxWidth?: number | string;

  themePreset?: ThemePreset;
  background?: ThemeBackgroundPaint;
  color?: ThemePaint;
  radius?: RadiusValue;

  "data-color-mode"?: string;
}
