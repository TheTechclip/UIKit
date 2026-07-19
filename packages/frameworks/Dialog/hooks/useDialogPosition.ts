import { useViewportHeight } from "@musecat/functionkit";
import { useCallback, useLayoutEffect, useState } from "react";
import { SizePX } from "../../shared/sizing";
import type { OffsetConfig } from "../Dialog.types";

export type PopoverPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "right";

interface UseDialogPositionProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  placement?: PopoverPlacement;
  strategy?: "anchored" | "center-selected";
  selectedItemSelector?: string;
  matchAnchorWidth?: boolean;
  coverAnchor?: boolean;
  gap?: number;
  margin?: number;
  recalcKey?: string | number;
  offset?: OffsetConfig;
}

export function useDialogPosition(props: UseDialogPositionProps) {
  const { height: viewportHeight } = useViewportHeight();
  const {
    open,
    anchorRef,
    contentRef,
    placement = "bottom-start",
    strategy = "anchored",
    selectedItemSelector = '[data-selected="true"]',
    matchAnchorWidth = false,
    coverAnchor = false,
    gap = 12,
    margin = 8,
    offset,
  } = props;
  const [topValue, setTopValue] = useState<number | null>(null);
  const [leftValue, setLeftValue] = useState<number | null>(null);
  const [maxHeightValue, setMaxHeightValue] = useState(400);
  const [isPositionReady, setIsPositionReady] = useState(false);
  const [computedWidth, setComputedWidth] = useState<number | null>(null);
  const [resolvedPlacement, setResolvedPlacement] =
    useState<string>("bottom-left");

  const _toPx = useCallback(
    (value: number | string | undefined, fallback: number) => {
      if (typeof window === "undefined") return fallback;
      const rootFont =
        parseFloat(
          window.getComputedStyle(document.documentElement).fontSize,
        ) || 16;
      if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        const numeric = parseFloat(normalized);
        if (Number.isNaN(numeric)) return fallback;
        if (normalized.endsWith("px")) return numeric;
        if (normalized.endsWith("vh"))
          return window.innerHeight * (numeric / 100);
        if (normalized.endsWith("vw"))
          return window.innerWidth * (numeric / 100);
      }
      return SizePX(value, fallback, rootFont);
    },
    [],
  );

  const getPlacementPosition = useCallback(
    (
      row: "top" | "middle" | "bottom",
      col: "left" | "center" | "right",
      anchorRect: DOMRect,
      contentRect: DOMRect,
    ) => {
      const controlTop = anchorRect.top;
      const controlLeft = anchorRect.left;
      const controlHeight = anchorRect.height;
      const controlWidth = anchorRect.width;
      const contentHeight = contentRect.height;
      const contentWidth = contentRect.width;

      const top =
        row === "top"
          ? controlTop - contentHeight - gap
          : row === "middle"
            ? controlTop + (controlHeight - contentHeight) / 2
            : controlTop + controlHeight + gap;

      const left =
        col === "left"
          ? row === "middle"
            ? controlLeft - contentWidth - gap
            : controlLeft
          : col === "center"
            ? controlLeft + (controlWidth - contentWidth) / 2
            : row === "middle"
              ? controlLeft + controlWidth + gap
              : controlLeft + controlWidth - contentWidth;

      return { top, left };
    },
    [gap],
  );

  const updatePosition = useCallback(() => {
    if (!open || !anchorRef.current || !contentRef.current) return;

    const anchorEl = anchorRef.current;
    const contentEl = contentRef.current;
    const anchorRect = anchorEl.getBoundingClientRect();
    const contentRect = {
      width: contentEl.offsetWidth || contentEl.clientWidth || 0,
      height: contentEl.offsetHeight || contentEl.clientHeight || 0,
    } as DOMRect;

    if (matchAnchorWidth) {
      setComputedWidth(anchorRect.width);
    } else {
      setComputedWidth(null);
    }

    let preferredTop = 0;
    let preferredLeft = 0;
    let finalPlacement = resolvedPlacement;

    let row: "top" | "middle" | "bottom" = "bottom";
    let col: "left" | "center" | "right" = "left";

    if (placement === "top") {
      row = "top";
      col = "center";
    } else if (placement === "top-start") {
      row = "top";
      col = "left";
    } else if (placement === "top-end") {
      row = "top";
      col = "right";
    } else if (placement === "bottom") {
      row = "bottom";
      col = "center";
    } else if (placement === "bottom-start") {
      row = "bottom";
      col = "left";
    } else if (placement === "bottom-end") {
      row = "bottom";
      col = "right";
    } else if (placement === "left") {
      row = "middle";
      col = "left";
    } else if (placement === "right") {
      row = "middle";
      col = "right";
    }

    if (strategy === "center-selected") {
      const selectedEl = contentEl.querySelector(
        selectedItemSelector,
      ) as HTMLElement | null;
      const firstOptionEl = contentEl.querySelector(
        '[role="option"]',
      ) as HTMLElement | null;
      const targetEl = selectedEl ?? firstOptionEl;
      if (targetEl) {
        const controlCenterY = anchorRect.top + anchorRect.height / 2;
        const targetCenterY = targetEl.offsetTop + targetEl.offsetHeight / 2;
        preferredTop = controlCenterY - targetCenterY;
      } else {
        preferredTop = anchorRect.bottom + gap;
      }
      preferredLeft = anchorRect.left;
      finalPlacement = "bottom-left";
    } else {
      const pos = getPlacementPosition(row, col, anchorRect, contentRect);
      preferredTop = pos.top;
      preferredLeft = pos.left;
      finalPlacement = `${row}-${col}`;
    }

    if (coverAnchor) {
      if (row === "bottom") {
        preferredTop -= anchorRect.height + gap;
      } else if (row === "top") {
        preferredTop += anchorRect.height + gap;
      } else if (row === "middle") {
        if (col === "left") {
          preferredLeft += anchorRect.width + gap;
        } else if (col === "right") {
          preferredLeft -= anchorRect.width + gap;
        }
      }
    }

    if (offset) {
      const offsetX = _toPx(offset.x, 0);
      const offsetY = _toPx(offset.y, 0);
      preferredLeft += offsetX;
      preferredTop += offsetY;
    }

    const minTop = margin;
    const maxTop =
      (viewportHeight || window.innerHeight) - margin - contentRect.height;
    const nextTop = Math.max(minTop, Math.min(maxTop, preferredTop));
    const minLeft = margin;
    const maxLeft =
      (window.visualViewport?.width ?? window.innerWidth) -
      margin -
      contentRect.width;
    const nextLeft = Math.max(minLeft, Math.min(maxLeft, preferredLeft));

    setTopValue(nextTop);
    setLeftValue(nextLeft);
    setResolvedPlacement(finalPlacement);

    const availableHeight =
      strategy === "center-selected"
        ? (viewportHeight || window.innerHeight) - margin * 2
        : row === "top"
          ? anchorRect.top - gap - margin
          : row === "bottom"
            ? (viewportHeight || window.innerHeight) -
              margin -
              (anchorRect.bottom + gap)
            : (viewportHeight || window.innerHeight) - margin * 2;
    setMaxHeightValue(Math.max(100, availableHeight));
  }, [
    open,
    anchorRef,
    contentRef,
    placement,
    strategy,
    selectedItemSelector,
    matchAnchorWidth,
    coverAnchor,
    gap,
    margin,
    offset,
    resolvedPlacement,
    getPlacementPosition,
    viewportHeight,
    _toPx,
  ]);

  useLayoutEffect(() => {
    if (!open) {
      setIsPositionReady(false);
      setTopValue(null);
      setLeftValue(null);
      return;
    }
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        updatePosition();
        setIsPositionReady(true);
      });
    };

    schedule();

    const contentEl = contentRef.current;
    const anchorEl = anchorRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => schedule());
      if (contentEl) resizeObserver.observe(contentEl);
      if (anchorEl) resizeObserver.observe(anchorEl);
    }

    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
    };
  }, [open, updatePosition, anchorRef, contentRef]);

  return {
    topValue,
    leftValue,
    maxHeightValue,
    resolvedPlacement,
    computedWidth,
    isPositionReady,
  };
}
