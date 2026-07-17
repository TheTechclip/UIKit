import type { ReactNode } from "react";
import type {
  DialogMobileMode,
  ExitConfig,
  PopoverConfig,
  SheetConfig,
} from "@/packages/Frameworks/Dialog/Dialog.types";

export interface ContentItem {
  type: "option";
  value: string | number;
  label: ReactNode;
  icon?: string;
  description?: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export type Contents = ContentItem[];

export interface ContextMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  popoverOwnerId: string;
  listId: string;
  listLabelId?: string;
  role?: string;
  isInteractionDisabled: boolean;
  contents: Contents;

  recalcKey: string;
  popoverConfig?: Partial<PopoverConfig>;
  sheetConfig?: SheetConfig;
  exit?: ExitConfig;
  mobileMode?: DialogMobileMode;
  children?: React.ReactNode;

  showCheck?: boolean;

  activeIndex?: number;
  onActiveIndexChange?: (index: number | ((prev: number) => number)) => void;
  openSource?: "mouse" | "keyboard";
  onOpenSourceChange?: (source: "mouse" | "keyboard") => void;
}
