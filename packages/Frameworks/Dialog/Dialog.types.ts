import type { ReactNode, RefObject } from "react";
import type { ButtonProps } from "../../Components/Button/Button.types";
import type { IconProps } from "../../Components/Icon/Icon.types";
import type { RadiusProps } from "../Theme/Radius.types";
import type {
  BackgroundBlurValue,
  BorderProps,
  ThemeBackgroundPaint,
  ThemeSystemProps,
} from "../Theme/Theme.types";

export type DialogMode = "popover" | "modal" | "sheet";
export type DialogMobileMode = "modal" | "sheet";

export interface ExitConfirmOptions {
  title?: string;
  caption?: string;
  confirmText?: string;
  cancelText?: string;
}

export interface ExitConfig {
  overlay?: boolean;
  escape?: boolean;
  confirm?: ExitConfirmOptions;
  icon?: boolean | ReactNode;
  footerButton?: boolean | ReactNode;
}

export interface OffsetConfig {
  x?: number | string;
  y?: number | string;
  width?: number | string;
}

export interface DialogHeaderConfig {
  icon?: IconProps;
  title?: ReactNode;
  caption?: ReactNode;
  content?: ReactNode;
}

export interface DialogFooterConfig {
  columnLayout?: boolean;
  content?: ReactNode;
  buttons?: (ButtonProps & { key?: string })[];
  buttonCondensed?: boolean | "pc";
}

export type PopoverHeaderConfig = DialogHeaderConfig;
export type PopoverFooterConfig = DialogFooterConfig;

export interface ModalHeaderConfig extends DialogHeaderConfig {
  centered?: boolean;
}
export type ModalFooterConfig = DialogFooterConfig;

export interface SheetHeaderConfig extends DialogHeaderConfig {
  iconReversed?: boolean;
}
export type SheetFooterConfig = DialogFooterConfig;

type DialogBaseConfig = ThemeSystemProps & BorderProps & RadiusProps;

export interface PopoverConfig extends DialogBaseConfig {
  anchorRef: RefObject<HTMLElement | null>;
  placement?:
    | "top"
    | "top-start"
    | "top-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "left"
    | "right";
  strategy?: "anchored" | "center-selected";
  selectedItemSelector?: string;
  matchAnchorWidth?: boolean;
  coverAnchor?: boolean;
  gap?: number;
  margin?: number;
  stopInteractionPropagation?: boolean;
  recalcKey?: string | number;
  popoverOwnerId?: string;
  header?: PopoverHeaderConfig;
  footer?: PopoverFooterConfig;
  exit?: ExitConfig;

  closeOnClickTrigger?: boolean;
  outside?: DialogOutsideConfig;
  offset?: OffsetConfig;
  maxHeight?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

export interface ModalConfig extends DialogBaseConfig {
  header?: ModalHeaderConfig;
  footer?: ModalFooterConfig;
  exit?: ExitConfig;
  custom?: ReactNode;
  defaultEnterAction?: () => void;
  maintainWhenRouting?: boolean;
  immersive?: boolean;
  outside?: DialogOutsideConfig;
  portalClassName?: string;
  portalStyle?: React.CSSProperties;
  contentClassName?: string;
  contentStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
  popoverOwnerId?: string;
}

export interface SheetConfig extends DialogBaseConfig {
  header?: SheetHeaderConfig;
  footer?: SheetFooterConfig;
  exit?: ExitConfig;
  snapPoints?: number[];
  defaultSnap?: number;
  min?: number | string;
  max?: number | string;
  freeDrag?: boolean;
  disableDrag?: boolean;
  outside?: DialogOutsideConfig;
  className?: string;
  style?: React.CSSProperties;
  popoverOwnerId?: string;
}

export interface FunnelStepConfig {
  name: string;
  title?: ReactNode;
  caption?: ReactNode;
  icon?: IconProps;
  content: ReactNode;
  nextDisabled?: boolean;
  onNext?: () => boolean | Promise<boolean> | string;
}

export interface FunnelHistory {
  push: (step: string, context?: any) => void;
  replace: (step: string, context?: any) => void;
  back: () => void;
  go?: (index: number) => void;
}

export interface FunnelNavigationConfig {
  back?: boolean | ReactNode;
  backLocation?:
    | "header"
    | "footer"
    | { pc?: "header" | "footer"; mobile?: "header" | "footer" };
  next?: boolean | ReactNode;
  nextLocation?:
    | "header"
    | "footer"
    | { pc?: "header" | "footer"; mobile?: "header" | "footer" };
  exit?: boolean | ReactNode;
  exitLocation?:
    | "header"
    | "footer"
    | { pc?: "header" | "footer"; mobile?: "header" | "footer" };
}

export interface FunnelConfig {
  id: string;
  steps: FunnelStepConfig[];
  onFinish?: () => void;
  onMount?: (history: FunnelHistory) => void;
  loading?: boolean;
  isSubmitted?: boolean;
  onRestart?: () => void;
  navigation?: FunnelNavigationConfig;
  preset?: "classic" | "oobe";
  footer?: {
    content?: ReactNode;
    columnLayout?: boolean;
    buttonCondensed?: boolean | "pc";
  };
}

export interface DialogContextValue {
  id: string;
  mode: DialogMode;
  open: boolean;
  closeDialog: () => void;
  loading?: boolean;
  funnel?: {
    currentStep: string;
    currentIndex: number;
    totalSteps: number;
    history: FunnelHistory;
  };
}

export interface DialogOutsideOptions {
  lockBodyScroll?: boolean;
  background?: ThemeBackgroundPaint;
  backgroundBlur?: BackgroundBlurValue;
  className?: string;
  style?: React.CSSProperties;
}

export type DialogOutsideConfig = boolean | DialogOutsideOptions;

export interface CommonDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  zIndex?: number;
  id?: string;
  width?: number | string;
  height?: number | string;
  content?: ReactNode;
  role?: string;
  exit?: ExitConfig;
  "data-color-mode"?: string;
}

export type DialogProps =
  | (CommonDialogProps & {
      mode: "popover" | "modal";
      children?: ReactNode;
      content?: ReactNode;
      offset?: OffsetConfig;
      mobileMode?: DialogMobileMode;
      popover?: PopoverConfig;
      modal?: ModalConfig;
      sheet?: SheetConfig;
      funnel?: never;
    })
  | (CommonDialogProps & {
      mode: "sheet";
      children?: ReactNode;
      content?: ReactNode;
      offset?: never;
      mobileMode?: never;
      popover?: never;
      modal?: never;
      sheet?: SheetConfig;
      funnel?: never;
    })
  | (CommonDialogProps & {
      mode: "popover" | "modal";
      children?: never;
      content?: never;
      offset?: OffsetConfig;
      mobileMode?: DialogMobileMode;
      popover?: Omit<PopoverConfig, "header" | "footer" | "exit">;
      modal?: Omit<ModalConfig, "header" | "footer" | "custom" | "exit">;
      sheet?: Omit<SheetConfig, "header" | "footer" | "exit">;
      funnel: FunnelConfig;
    })
  | (CommonDialogProps & {
      mode: "sheet";
      children?: never;
      content?: never;
      offset?: never;
      mobileMode?: never;
      popover?: never;
      modal?: never;
      sheet?: Omit<SheetConfig, "header" | "footer" | "exit">;
      funnel: FunnelConfig;
    });
