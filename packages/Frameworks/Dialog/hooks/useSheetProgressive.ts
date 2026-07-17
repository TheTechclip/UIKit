"use client";

import type { MotionValue } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { RadiusValue } from "@/packages/Frameworks/Theme/Radius.types";

const EDGE_INSET_MAX_PX = 8;
const BOTTOM_GAP_PX = 8;
const BOTTOM_RADIUS_MAX_PX = 24;
const BOTTOM_RADIUS_THRESHOLD = 1;

export interface UseSheetProgressiveInput {
  y: MotionValue<number>;
  normalizedSnapPoints: number[];
  viewportHeight: number;
  maxSnap: number;
  isFreeDrag: boolean;
  hasExplicitSnapPoints: boolean;
}

export interface UseSheetProgressiveOutput {
  inset: number;
  bottomGap: number;
  radiusArr: RadiusValue;
}

function computeProgress(
  latestY: number,
  maxSnap: number,
  firstSnap: number,
  lastSnap: number,
  vh: number,
) {
  if (!vh) return 0;
  const snap = maxSnap - latestY / vh;
  return Math.max(0, Math.min(1, (snap - firstSnap) / (lastSnap - firstSnap)));
}

export function useSheetProgressive({
  y,
  normalizedSnapPoints,
  viewportHeight,
  maxSnap,
  isFreeDrag,
  hasExplicitSnapPoints,
}: UseSheetProgressiveInput): UseSheetProgressiveOutput {
  const firstSnap = normalizedSnapPoints[0];
  const lastSnap = normalizedSnapPoints.at(-1) ?? 0;
  const hasProgression =
    hasExplicitSnapPoints && normalizedSnapPoints.length > 1 && !isFreeDrag;

  const [inset, setInset] = useState(0);
  const [bottomGap, setBottomGap] = useState(0);
  const [bottomRadius, setBottomRadius] = useState(BOTTOM_RADIUS_MAX_PX);

  useEffect(() => {
    if (!hasProgression) {
      setInset(0);
      setBottomGap(0);
      setBottomRadius(BOTTOM_RADIUS_MAX_PX);
      return;
    }

    const update = (latestY: number) => {
      const vh = viewportHeight || 800;
      const p = computeProgress(latestY, maxSnap, firstSnap, lastSnap, vh);
      setInset(Math.round(EDGE_INSET_MAX_PX * (1 - p)));
      setBottomGap(Math.round(BOTTOM_GAP_PX * (1 - p)));
      setBottomRadius(Math.round(BOTTOM_RADIUS_MAX_PX * (1 - p)));
    };

    update(y.get());
    return y.on("change", update);
  }, [y, hasProgression, viewportHeight, maxSnap, firstSnap, lastSnap]);

  const radiusArr: RadiusValue = useMemo(() => {
    if (
      !hasProgression ||
      bottomRadius >= BOTTOM_RADIUS_MAX_PX - BOTTOM_RADIUS_THRESHOLD
    ) {
      return ["ExtraBold", "ExtraBold", "ExtraBold", "ExtraBold"] as const;
    }
    if (bottomRadius <= BOTTOM_RADIUS_THRESHOLD) {
      return ["ExtraBold", "ExtraBold", "None", "None"] as const;
    }
    return bottomRadius <= 6
      ? (["ExtraBold", "ExtraBold", "ExtraLight", "ExtraLight"] as const)
      : bottomRadius <= 12
        ? (["ExtraBold", "ExtraBold", "Light", "Light"] as const)
        : bottomRadius <= 16
          ? (["ExtraBold", "ExtraBold", "Regular", "Regular"] as const)
          : bottomRadius <= 20
            ? (["ExtraBold", "ExtraBold", "Bold", "Bold"] as const)
            : (["ExtraBold", "ExtraBold", "ExtraBold", "ExtraBold"] as const);
  }, [hasProgression, bottomRadius]);

  return { inset, bottomGap, radiusArr };
}
