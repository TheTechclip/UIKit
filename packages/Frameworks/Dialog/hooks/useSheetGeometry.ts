"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SheetConfig } from "../Dialog.types";

function toPx(
  value: number | string | undefined,
  viewportHeight: number,
  fallback: number,
): number {
  if (value === undefined) return fallback;
  if (typeof value === "number") {
    if (value > 0 && value <= 1) return viewportHeight * value;
    return value;
  }
  const normalized = value.trim().toLowerCase();
  const numeric = parseFloat(normalized);
  if (Number.isNaN(numeric)) return fallback;

  if (normalized.endsWith("rem")) {
    if (typeof window !== "undefined") {
      const rootFontSize =
        parseFloat(
          window.getComputedStyle(document.documentElement).fontSize,
        ) || 16;
      return numeric * rootFontSize;
    }
    return numeric * 16;
  }
  if (normalized.endsWith("px")) return numeric;
  if (normalized.endsWith("vh")) return viewportHeight * (numeric / 100);
  if (normalized.endsWith("%")) return viewportHeight * (numeric / 100);

  if (numeric > 0 && numeric <= 1) return viewportHeight * numeric;
  return numeric;
}

function normalizeSnapPoints(points?: number[]) {
  const source = points?.length ? points : [0.5, 1];
  return Array.from(
    new Set(source.map((point) => Math.max(0.1, Math.min(1, point)))),
  ).sort((a, b) => a - b);
}

function resolveInitialSnapIndex(points: number[], defaultSnap?: number) {
  if (defaultSnap === undefined) return points.length - 1;
  if (
    Number.isInteger(defaultSnap) &&
    defaultSnap >= 0 &&
    defaultSnap < points.length
  ) {
    return defaultSnap;
  }
  const exactIndex = points.indexOf(defaultSnap);
  if (exactIndex >= 0) return exactIndex;
  return points.length - 1;
}

export { resolveInitialSnapIndex, toPx };

export interface SheetGeometryInput {
  config?: SheetConfig;
  height?: string | number;
  sheetHeightPx: number;
  open: boolean;
  rendered: boolean;
}

export interface SheetGeometryOutput {
  viewportHeight: number;
  getViewportHeight: () => number;
  minPx: number;
  maxPx: number;
  maxSnap: number;
  normalizedSnapPoints: number[];
  resolvedFreeDragHeightPx: number;
  getTargetYForSnap: (snap: number) => number;
  getGapHiddenY: (
    currentSnap: number,
    isFreeDrag: boolean,
    getTargetYForSnap: (snap: number) => number,
  ) => number;
  isFreeDrag: boolean;
  isMinDefault: boolean;
  snapHeightRatio: number;
}

const DEFAULT_MIN_REM = 7.2;
const DEFAULT_MIN_PX_FALLBACK = 115.2;

export function useSheetGeometry({
  config,
  height,
  sheetHeightPx,
  open,
  rendered,
}: SheetGeometryInput): SheetGeometryOutput {
  const [viewportHeight, setViewportHeight] = useState(0);

  const getViewportHeight = useCallback(
    () => window.visualViewport?.height ?? window.innerHeight,
    [],
  );

  useEffect(() => {
    if (!open && !rendered) return;
    const update = () => {
      setViewportHeight(getViewportHeight());
    };
    update();
    window.visualViewport?.addEventListener("resize", update);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.visualViewport?.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [open, rendered, getViewportHeight]);

  const isFreeDrag = config?.freeDrag === true;
  const isMinDefault = isFreeDrag && config?.min === undefined;

  const minPx = useMemo(() => {
    const vh = viewportHeight || 800;
    return toPx(
      config?.min,
      vh,
      toPx(`${DEFAULT_MIN_REM}rem`, vh, DEFAULT_MIN_PX_FALLBACK),
    );
  }, [config?.min, viewportHeight]);

  const maxPx = useMemo(() => {
    const vh = viewportHeight || 800;
    const isMaxContent = height === undefined && !config?.snapPoints?.length;
    const baseHeight = isMaxContent && sheetHeightPx > 0 ? sheetHeightPx : vh;
    return toPx(config?.max, baseHeight, baseHeight);
  }, [config?.max, viewportHeight, height, config?.snapPoints, sheetHeightPx]);

  const resolvedFreeDragHeightPx = useMemo(
    () => Math.max(maxPx, minPx),
    [maxPx, minPx],
  );

  const _snapPointsStr = JSON.stringify(config?.snapPoints);
  const normalizedSnapPoints = useMemo(
    () =>
      config?.snapPoints?.length
        ? normalizeSnapPoints(config?.snapPoints)
        : [1],
    [config?.snapPoints?.length, config?.snapPoints],
  );

  const maxSnap = useMemo(
    () =>
      isFreeDrag
        ? maxPx / (viewportHeight || 800)
        : (normalizedSnapPoints.at(-1) ?? 1),
    [isFreeDrag, normalizedSnapPoints, maxPx, viewportHeight],
  );

  const snapHeightRatio = useMemo(
    () => maxSnap / (normalizedSnapPoints.at(-1) ?? 1),
    [maxSnap, normalizedSnapPoints],
  );

  const getTargetYForSnap = useCallback(
    (snap: number) => {
      const vh = viewportHeight || getViewportHeight();
      if (isFreeDrag) return 0;
      return vh * (maxSnap - snap);
    },
    [viewportHeight, maxSnap, getViewportHeight, isFreeDrag],
  );

  const getGapHiddenY = useCallback(
    (
      currentSnap: number,
      isFreeDrag: boolean,
      getTargetYForSnap: (snap: number) => number,
    ) => {
      const h = viewportHeight || getViewportHeight() || 800;
      const restY = isFreeDrag ? 0 : getTargetYForSnap(currentSnap);
      return restY + h;
    },
    [viewportHeight, getViewportHeight],
  );

  return {
    viewportHeight,
    getViewportHeight,
    minPx,
    maxPx,
    maxSnap,
    normalizedSnapPoints,
    resolvedFreeDragHeightPx,
    getTargetYForSnap,
    getGapHiddenY,
    isFreeDrag,
    isMinDefault,
    snapHeightRatio,
  };
}
