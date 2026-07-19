import type { UniqueIdentifier } from "@dnd-kit/core";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { UIKitSizeValue } from "../../shared/sizing";
import type { ViewProps } from "../View.types";

export type DNDViewItemState<T> = {
  item: T;
  id: UniqueIdentifier;
  index: number;
  dragging: boolean;
  sorting: boolean;
  handle: ReactNode;
  handleProps: HTMLAttributes<HTMLElement>;
};

export type DNDViewStrategy = "vertical" | "horizontal" | "rect";

export interface DNDViewProps<T>
  extends Pick<
    ViewProps,
    | "className"
    | "style"
    | "alignItems"
    | "justifyContent"
    | "gap"
    | "wrap"
    | "fullWidth"
    | "gridTemplateColumns"
    | "gridTemplateRows"
    | "gridAutoFlow"
    | "background"
    | "color"
    | "themePreset"
    | "themeInteractive"
    | "selected"
    | "border"
    | "radius"
    | "backgroundBlur"
    | "data-color-mode"
  > {
  items: T[];
  onReorder: (items: T[]) => void;
  getKey: (item: T) => UniqueIdentifier;
  renderItem: (item: T, state: DNDViewItemState<T>) => ReactNode;
  renderHandle?: (
    props: HTMLAttributes<HTMLElement>,
    state: DNDViewItemState<T>,
  ) => ReactNode;
  disabled?: boolean;
  dragHandle?: boolean;
  keyboard?: boolean;
  strategy?: DNDViewStrategy;
  activationDistance?: number;
  touchActivationDelay?: number;
  touchActivationTolerance?: number;
  width?: UIKitSizeValue;
  height?: UIKitSizeValue;
  padding?: UIKitSizeValue;
  margin?: UIKitSizeValue;
  itemStyle?: CSSProperties;
}
