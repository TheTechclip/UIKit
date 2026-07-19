import type { MotionProps } from "motion/react";
import type { LinkProps } from "next/link";
import type { PopoverConfig } from "../Dialog/Dialog.types";
import type { PaddingProps } from "../shared/Padding.types";
import type { WindProps } from "../shared/Wind.types";
import type { RadiusProps } from "../Theme/Radius.types";
import type { BorderProps, ThemeSystemProps } from "../Theme/Theme.types";
export interface PressableProps
  extends Omit<
      React.HTMLAttributes<HTMLElement>,
      | "title"
      | "onClick"
      | "onChange"
      | "value"
      | "checked"
      | "type"
      | "disabled"
      | "tabIndex"
      | "popover"
      | "color"
    >,
    ThemeSystemProps,
    BorderProps,
    RadiusProps,
    PaddingProps,
    WindProps {
  "data-color-mode"?: string;
  motion?: MotionProps;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  form?: true | Omit<React.ComponentProps<"form">, "children">;
  href?: LinkProps["href"];
  target?: HTMLAnchorElement["target"];
  rel?: HTMLAnchorElement["rel"];
  download?: React.AnchorHTMLAttributes<HTMLAnchorElement>["download"];
  checked?: HTMLInputElement["checked"];
  onClick?: (e: React.MouseEvent) => void;
  onChange?: (e: React.ChangeEvent) => void;
  title?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-controls"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
  type?: HTMLButtonElement["type"] | "checkbox" | "radio";
  disabled?: boolean;
  readOnly?: boolean;
  value?: string | number;
  name?: string;
  ref?: React.Ref<HTMLElement>;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
  onPointerCancel?: (e: React.PointerEvent) => void;
  onPointerLeave?: (e: React.PointerEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onTouchEnd?: (e: React.TouchEvent) => void;
  onTouchCancel?: (e: React.TouchEvent) => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onKeyUp?: (e: React.KeyboardEvent) => void;
  onLongPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  onLongPressEnd?: (e: React.MouseEvent | React.TouchEvent) => void;
  longPressDelay?: number;
  tabIndex?: number;
  popover?: Omit<PopoverConfig, "anchorRef"> & {
    content: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    closeOnOutsideClick?: boolean;
    recalcKey?: string | number;
  };
}
