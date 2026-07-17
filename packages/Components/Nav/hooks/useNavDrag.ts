"use client";

import { useCallback, useRef } from "react";
import type { NavProps } from "@/packages/Components/Nav/Nav.types";

const DRAG_SELECTION_TOUCH_ACTIVATION_DISTANCE = 10;
const DRAG_SELECTION_TOUCH_HORIZONTAL_RATIO = 1.75;

export type DragSelectionMetric = {
  centerX: number;
  index: number;
  offsetLeft: number;
  width: number;
  value: string | number;
};

export interface UseNavDragProps {
  items: NavProps["items"];
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  dragSelection: boolean;
  radio: boolean;
  dragSelectionCommit: "change" | "end";
  selectValue: (nextValue: string | number | undefined) => void;
  setDragPreviewValue: (value: string | number | undefined) => void;
  applyIndicatorStyle: (style?: React.CSSProperties) => void;
  committedIndicatorStyleRef: React.MutableRefObject<
    React.CSSProperties | undefined
  >;
  setIsDraggingSelection: (value: boolean) => void;
  setIsReleasingSelection: (value: boolean) => void;
  setPressed: (value: boolean) => void;
  dragReleaseTimer: { clear: () => void; start: (ms: number) => void };
}

export function useNavDrag({
  items,
  itemRefs,
  dragSelection,
  radio,
  dragSelectionCommit,
  selectValue,
  setDragPreviewValue,
  applyIndicatorStyle,
  committedIndicatorStyleRef,
  setIsDraggingSelection,
  setIsReleasingSelection,
  setPressed,
  dragReleaseTimer,
}: UseNavDragProps) {
  const dragPointerIdRef = useRef<number | null>(null);
  const dragSelectedValueRef = useRef<string | number | undefined>(undefined);
  const dragStartPointRef = useRef<{ x: number; y: number } | null>(null);
  const dragGestureStateRef = useRef<"idle" | "pending" | "active">("idle");
  const dragStartFrameRef = useRef<number | null>(null);
  const dragMoveFrameRef = useRef<number | null>(null);
  const dragLatestClientXRef = useRef<number | null>(null);
  const dragRootLeftRef = useRef(0);
  const dragMetricsRef = useRef<DragSelectionMetric[]>([]);

  const commitDragPreviewValue = useCallback(
    (nextValue: string | number | undefined) => {
      if (nextValue === undefined) return;

      if (dragSelectionCommit === "change") {
        selectValue(nextValue);
        return;
      }

      setDragPreviewValue(nextValue);
    },
    [dragSelectionCommit, selectValue, setDragPreviewValue],
  );

  const getDragSelectionFromClientX = useCallback(
    (clientX: number): { element?: HTMLElement; value?: string | number } => {
      const dragMetrics = dragMetricsRef.current;
      if (dragMetrics.length > 0) {
        let closestMetric: DragSelectionMetric | undefined;
        let closestDistance = Number.POSITIVE_INFINITY;

        dragMetrics.forEach((metric) => {
          const distance = Math.abs(clientX - metric.centerX);

          if (distance < closestDistance) {
            closestDistance = distance;
            closestMetric = metric;
          }
        });

        if (!closestMetric) {
          return {};
        }

        return {
          element: itemRefs.current[closestMetric.index] ?? undefined,
          value: closestMetric.value,
        };
      }

      let closestValue: string | number | undefined;
      let closestEl: HTMLElement | undefined;
      let closestDistance = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((el, index) => {
        const value = items[index]?.value;
        if (!el || value === undefined) return;

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const distance = Math.abs(clientX - centerX);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestValue = value;
          closestEl = el;
        }
      });

      return { element: closestEl, value: closestValue };
    },
    [items, itemRefs],
  );

  const getIndicatorStyleForValue = useCallback(
    (
      nextValue: string | number | undefined,
    ): React.CSSProperties | undefined => {
      if (nextValue === undefined) return undefined;

      const index = items.findIndex((item) => item.value === nextValue);
      const el = index >= 0 ? itemRefs.current[index] : null;
      if (!el) return undefined;

      return {
        left: el.offsetLeft,
        width: el.offsetWidth,
        opacity: 1,
      };
    },
    [items, itemRefs],
  );

  const updateDragSelection = useCallback(
    (clientX: number) => {
      const { element, value } = getDragSelectionFromClientX(clientX);
      if (!element || value === undefined) return;

      const previousValue = dragSelectedValueRef.current;
      dragSelectedValueRef.current = value;
      if (value !== previousValue) {
        commitDragPreviewValue(value);
      }

      const dragMetrics = dragMetricsRef.current;
      const firstMetric = dragMetrics[0];
      const lastMetric = dragMetrics.at(-1);
      const width = element.offsetWidth;
      const minLeft = firstMetric?.offsetLeft ?? 0;
      const maxLeft =
        lastMetric !== undefined
          ? lastMetric.offsetLeft + lastMetric.width - width
          : minLeft;
      const pointerLeft = clientX - dragRootLeftRef.current - width / 2;
      const left = Math.min(Math.max(pointerLeft, minLeft), maxLeft);

      applyIndicatorStyle({
        left,
        width,
        opacity: 1,
      });
    },
    [applyIndicatorStyle, commitDragPreviewValue, getDragSelectionFromClientX],
  );

  const canDragSelection = Boolean(dragSelection && radio);

  const resetDragGesture = useCallback(() => {
    dragPointerIdRef.current = null;
    dragStartPointRef.current = null;
    dragGestureStateRef.current = "idle";
    dragSelectedValueRef.current = undefined;
    dragLatestClientXRef.current = null;
    dragMetricsRef.current = [];
  }, []);

  const measureDragSelection = useCallback(
    (rootEl: HTMLElement) => {
      dragRootLeftRef.current = rootEl.getBoundingClientRect().left;
      dragMetricsRef.current = itemRefs.current.flatMap((el, index) => {
        const value = items[index]?.value;
        if (!el || value === undefined) return [];

        const rect = el.getBoundingClientRect();
        return [
          {
            centerX: rect.left + rect.width / 2,
            index,
            offsetLeft: el.offsetLeft,
            width: el.offsetWidth,
            value,
          },
        ];
      });
    },
    [items, itemRefs],
  );

  const queueDragSelectionUpdate = useCallback(() => {
    if (dragMoveFrameRef.current !== null) {
      return;
    }

    dragMoveFrameRef.current = requestAnimationFrame(() => {
      dragMoveFrameRef.current = null;
      const clientX = dragLatestClientXRef.current;
      if (clientX === null) return;

      updateDragSelection(clientX);
    });
  }, [updateDragSelection]);

  const beginDragSelection = useCallback(
    (rootEl: HTMLDivElement, pointerId: number, clientX: number) => {
      dragGestureStateRef.current = "active";
      dragLatestClientXRef.current = clientX;
      setDragPreviewValue(undefined);
      setIsDraggingSelection(true);
      measureDragSelection(rootEl);

      if (!rootEl.hasPointerCapture(pointerId)) {
        rootEl.setPointerCapture(pointerId);
      }

      dragStartFrameRef.current = requestAnimationFrame(() => {
        updateDragSelection(clientX);
        dragStartFrameRef.current = null;
      });
    },
    [
      measureDragSelection,
      updateDragSelection,
      setDragPreviewValue,
      setIsDraggingSelection,
    ],
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== 0) return;

      setPressed(true);

      if (!canDragSelection) return;

      dragPointerIdRef.current = event.pointerId;
      dragStartPointRef.current = { x: event.clientX, y: event.clientY };
      dragGestureStateRef.current =
        event.pointerType === "mouse" ? "active" : "pending";
      dragSelectedValueRef.current = undefined;
      dragReleaseTimer.clear();
      setIsReleasingSelection(false);
      if (event.pointerType === "mouse") {
        beginDragSelection(event.currentTarget, event.pointerId, event.clientX);
        event.preventDefault();
      }
    },
    [
      beginDragSelection,
      canDragSelection,
      dragReleaseTimer,
      setIsReleasingSelection,
      setPressed,
    ],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (dragPointerIdRef.current !== event.pointerId) return;

      if (dragGestureStateRef.current === "pending") {
        const startPoint = dragStartPointRef.current;
        if (!startPoint) return;

        const deltaX = event.clientX - startPoint.x;
        const deltaY = event.clientY - startPoint.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (Math.max(absX, absY) < DRAG_SELECTION_TOUCH_ACTIVATION_DISTANCE) {
          return;
        }

        if (absX < absY * DRAG_SELECTION_TOUCH_HORIZONTAL_RATIO) {
          resetDragGesture();
          return;
        }

        beginDragSelection(event.currentTarget, event.pointerId, event.clientX);
        event.preventDefault();
        return;
      }

      if (dragGestureStateRef.current !== "active") return;

      if (dragStartFrameRef.current !== null) {
        cancelAnimationFrame(dragStartFrameRef.current);
        dragStartFrameRef.current = null;
      }
      dragLatestClientXRef.current = event.clientX;
      queueDragSelectionUpdate();
      event.preventDefault();
    },
    [beginDragSelection, queueDragSelectionUpdate, resetDragGesture],
  );

  const stopDragging = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      setPressed(false);
      if (dragPointerIdRef.current !== event.pointerId) return;

      if (dragGestureStateRef.current !== "active") {
        resetDragGesture();
        return;
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      if (dragStartFrameRef.current !== null) {
        cancelAnimationFrame(dragStartFrameRef.current);
        dragStartFrameRef.current = null;
      }
      if (dragMoveFrameRef.current !== null) {
        cancelAnimationFrame(dragMoveFrameRef.current);
        dragMoveFrameRef.current = null;
      }
      if (dragSelectionCommit === "end") {
        selectValue(dragSelectedValueRef.current);
      }
      const finalIndicatorStyle = getIndicatorStyleForValue(
        dragSelectedValueRef.current,
      );
      resetDragGesture();
      setIsDraggingSelection(false);
      setIsReleasingSelection(true);
      applyIndicatorStyle(
        finalIndicatorStyle ?? committedIndicatorStyleRef.current,
      );

      dragReleaseTimer.start(240);
    },
    [
      applyIndicatorStyle,
      dragSelectionCommit,
      getIndicatorStyleForValue,
      resetDragGesture,
      selectValue,
      setIsDraggingSelection,
      setIsReleasingSelection,
      setPressed,
      dragReleaseTimer,
      committedIndicatorStyleRef,
    ],
  );

  return {
    handlePointerDown,
    handlePointerMove,
    stopDragging,
    canDragSelection,
    dragStartFrameRef,
    dragMoveFrameRef,
  };
}
