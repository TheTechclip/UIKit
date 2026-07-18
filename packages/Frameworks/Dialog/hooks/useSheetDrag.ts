"use client";

import { animate, type MotionValue, useDragControls } from "motion/react";
import { useCallback, useRef } from "react";
import { motionTransitions } from "../../Motion/Motion.presets";
import { toPx } from "./useSheetGeometry";

const CLOSE_VELOCITY = 900;
const CLOSE_DISTANCE_RATIO = 0.34;
const SNAP_VELOCITY_PROJECTION = 0.18;

export interface DragHandlers {
  handleDragEnd: (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number }; velocity: { y: number } },
  ) => void;
  handleContentPointerDown: (e: React.PointerEvent) => void;
  handleContentPointerMove: (e: React.PointerEvent) => void;
  handleContentPointerUp: (e: React.PointerEvent) => void;
  handleContentPointerCancel: () => void;
}

export interface UseSheetDragInput {
  y: MotionValue<number>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  config?: {
    disableDrag?: boolean;
    freeDrag?: boolean;
    min?: number | string;
    snapPoints?: number[];
  };
  viewportHeight: number;
  getViewportHeight: () => number;
  sheetHeightPx: number;
  isFreeDrag: boolean;
  minPx: number;
  maxPx: number;
  maxSnap: number;
  normalizedSnapPoints: number[];
  resolvedFreeDragHeightPx: number;
  isMinDefault: boolean;
  snapIndex: number;
  currentSnap: number;
  getTargetYForSnap: (snap: number) => number;
  getGapHiddenY: (
    currentSnap: number,
    isFreeDrag: boolean,
    getTargetYForSnap: (snap: number) => number,
  ) => number;
  close: () => void;
  cancelEntranceAnimation: () => void;
  onSnapIndexChange?: (index: number) => void;
  onDragStateChange?: (dragging: boolean) => void;
}

export function useSheetDrag({
  y,
  scrollRef,
  config,
  viewportHeight,
  getViewportHeight,
  sheetHeightPx,
  isFreeDrag,
  minPx,
  maxPx,
  maxSnap,
  normalizedSnapPoints,
  resolvedFreeDragHeightPx,
  isMinDefault,
  snapIndex,
  currentSnap,
  getTargetYForSnap,
  getGapHiddenY,
  close,
  cancelEntranceAnimation,
  onSnapIndexChange,
  onDragStateChange,
}: UseSheetDragInput): DragHandlers {
  void maxPx;
  void getGapHiddenY;
  const _dragControls = useDragControls();
  const contentDraggingRef = useRef(false);
  const contentPointerActiveRef = useRef(false);
  const isScrollAtTopOnDownRef = useRef(false);
  const contentDragStartY = useRef(0);
  const contentDragSheetStartY = useRef(0);
  const contentDragPrevY = useRef(0);
  const contentDragPrevTime = useRef(0);

  const handleDragEnd = useCallback(
    (
      _: MouseEvent | TouchEvent | PointerEvent,
      info: { offset: { y: number }; velocity: { y: number } },
    ) => {
      const currentVh = viewportHeight || getViewportHeight();
      const currentY = y.get();
      const projectedY = currentY + info.velocity.y * SNAP_VELOCITY_PROJECTION;

      if (isFreeDrag) {
        const calculatedMinPx = toPx(
          config?.min,
          currentVh,
          toPx("7.2rem", currentVh, 115.2),
        );
        const projectedHeightPx = resolvedFreeDragHeightPx - projectedY;

        if (
          config?.min === undefined &&
          !isMinDefault &&
          (info.velocity.y > CLOSE_VELOCITY ||
            projectedHeightPx < calculatedMinPx * (1 - CLOSE_DISTANCE_RATIO))
        ) {
          onDragStateChange?.(false);
          close();
          return;
        }

        const minTargetY = Math.max(
          0,
          resolvedFreeDragHeightPx - calculatedMinPx,
        );
        const maxTargetY = 0;
        const targetY = Math.max(maxTargetY, Math.min(minTargetY, projectedY));

        animate(y, targetY, motionTransitions.sheet.snap);
        onDragStateChange?.(false);
        return;
      }

      const projectedSnap = maxSnap - projectedY / currentVh;
      const minSnap = normalizedSnapPoints[0] ?? 0.5;
      const isAtLowestSnap = snapIndex === 0;
      let releasedBelow: boolean;
      if (normalizedSnapPoints.length === 1) {
        releasedBelow = projectedY > (sheetHeightPx || currentVh) * 0.5;
      } else {
        releasedBelow = projectedSnap < minSnap * (1 - CLOSE_DISTANCE_RATIO);
      }
      const flickDown = info.velocity.y > CLOSE_VELOCITY && projectedY > 0;
      if (
        isAtLowestSnap &&
        config?.min === undefined &&
        (releasedBelow || flickDown)
      ) {
        onDragStateChange?.(false);
        close();
        return;
      }

      const nextIndex = normalizedSnapPoints.reduce(
        (closestIndex, snap, index) => {
          const closestDist = Math.abs(
            normalizedSnapPoints[closestIndex] - projectedSnap,
          );
          return Math.abs(snap - projectedSnap) < closestDist
            ? index
            : closestIndex;
        },
        snapIndex,
      );

      onSnapIndexChange?.(nextIndex);
      const targetY = getTargetYForSnap(normalizedSnapPoints[nextIndex]);
      animate(y, targetY, motionTransitions.sheet.snap);
      onDragStateChange?.(false);
    },
    [
      close,
      maxSnap,
      normalizedSnapPoints,
      snapIndex,
      viewportHeight,
      y,
      getTargetYForSnap,
      getViewportHeight,
      isFreeDrag,
      config?.min,
      resolvedFreeDragHeightPx,
      sheetHeightPx,
      isMinDefault,
      onSnapIndexChange,
      onDragStateChange,
    ],
  );

  const handleContentPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (config?.disableDrag) return;
      contentPointerActiveRef.current = true;
      onDragStateChange?.(true);

      const el = scrollRef?.current;
      isScrollAtTopOnDownRef.current = el ? el.scrollTop <= 1 : true;

      y.stop();
      cancelEntranceAnimation();
      const baseY = isFreeDrag ? 0 : getTargetYForSnap(currentSnap);
      y.jump(baseY);
      contentDraggingRef.current = false;
      contentDragStartY.current = e.clientY;
      contentDragSheetStartY.current = baseY;
      contentDragPrevY.current = e.clientY;
      contentDragPrevTime.current = performance.now();
    },
    [
      config?.disableDrag,
      y,
      isFreeDrag,
      getTargetYForSnap,
      currentSnap,
      cancelEntranceAnimation,
      onDragStateChange,
      scrollRef,
    ],
  );

  const handleContentPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (config?.disableDrag) return;
      if (!contentPointerActiveRef.current) return;
      if (!isScrollAtTopOnDownRef.current) return;
      const el = scrollRef?.current;
      if (!el) return;

      if (contentDraggingRef.current) {
        e.preventDefault();
        const deltaY = e.clientY - contentDragStartY.current;
        const maxDragY =
          isFreeDrag || config?.min !== undefined
            ? Math.max(0, resolvedFreeDragHeightPx - minPx)
            : Number.POSITIVE_INFINITY;
        y.set(
          Math.min(
            maxDragY,
            Math.max(0, contentDragSheetStartY.current + deltaY),
          ),
        );
        contentDragPrevY.current = e.clientY;
        contentDragPrevTime.current = performance.now();
        return;
      }

      if (el.scrollTop > 1) return;
      const deltaY = e.clientY - contentDragStartY.current;
      if (deltaY <= 4) return;

      contentDraggingRef.current = true;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      el.scrollTop = 0;
      el.style.touchAction = "none";
    },
    [
      config?.disableDrag,
      y,
      isFreeDrag,
      config?.min,
      resolvedFreeDragHeightPx,
      minPx,
      scrollRef?.current,
    ],
  );

  const handleContentPointerUp = useCallback(
    (e: React.PointerEvent) => {
      contentPointerActiveRef.current = false;
      const el = scrollRef?.current;
      if (el) {
        el.style.touchAction = "";
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {}
      }

      if (!contentDraggingRef.current) return;
      contentDraggingRef.current = false;

      const dt = Math.max(1, performance.now() - contentDragPrevTime.current);
      const dy = e.clientY - contentDragPrevY.current;
      const velocity = (dy / dt) * 1000;

      handleDragEnd(e.nativeEvent, {
        offset: { y: y.get() - contentDragSheetStartY.current },
        velocity: { y: velocity },
      });
    },
    [y, handleDragEnd, scrollRef?.current],
  );

  const handleContentPointerCancel = useCallback(() => {
    contentPointerActiveRef.current = false;
    if (!contentDraggingRef.current) return;
    contentDraggingRef.current = false;
    const el = scrollRef?.current;
    if (!el) return;
    el.style.touchAction = "";
    const currentVh = viewportHeight || getViewportHeight();
    const snapTargetY = isFreeDrag
      ? Math.max(
          0,
          resolvedFreeDragHeightPx -
            toPx(config?.min, currentVh, toPx("7.2rem", currentVh, 115.2)),
        )
      : getTargetYForSnap(currentSnap);
    animate(y, Math.max(0, snapTargetY), motionTransitions.sheet.snap);
    onDragStateChange?.(false);
  }, [
    isFreeDrag,
    config?.min,
    viewportHeight,
    resolvedFreeDragHeightPx,
    y,
    getTargetYForSnap,
    currentSnap,
    getViewportHeight,
    onDragStateChange,
    scrollRef?.current,
  ]);

  return {
    handleDragEnd,
    handleContentPointerDown,
    handleContentPointerMove,
    handleContentPointerUp,
    handleContentPointerCancel,
  };
}
