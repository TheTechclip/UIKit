"use client";

import clsx from "clsx";
import type { MotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { motionPresets } from "@/packages/Frameworks/Motion/Motion.presets";
import type {
  BackgroundBlurValue,
  ThemeBackgroundPaint,
} from "@/packages/Frameworks/Theme/Theme.types";
import { BackgroundBlur } from "@/packages/Frameworks/Theme/Theme.types";
import View from "@/packages/Frameworks/View/View";

interface BackgroundWrapperProps {
  open: boolean;
  showBackdrop: boolean;
  background?: ThemeBackgroundPaint;
  backgroundBlur?: BackgroundBlurValue;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  zIndex: number;
  overlayOpacity?: MotionValue<number>;
}

export default function BackgroundWrapper({
  open,
  showBackdrop,
  background: backgroundProp,
  backgroundBlur,
  className,
  style,
  onClick,
  zIndex,
  overlayOpacity,
}: BackgroundWrapperProps) {
  const [pointerEvents, setPointerEvents] = useState<"auto" | "none">("none");

  useEffect(() => {
    if (open) {
      setPointerEvents("auto");
    } else {
      const timer = setTimeout(() => {
        setPointerEvents("none");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!showBackdrop) return null;

  const backdropBg = backgroundProp ?? "BaseDark3TP6";
  const blurClass = BackgroundBlur(backgroundBlur ?? "None");

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.();
  };

  return (
    <View
      className={clsx(blurClass, className)}
      background={backdropBg}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "100%",
        bottom: "-8rem",
        zIndex,
        pointerEvents,
        ...style,
      }}
      motion={
        overlayOpacity
          ? { style: { opacity: overlayOpacity } }
          : motionPresets.backdrop(open)
      }
      onPointerDown={handlePointerDown}
      onClick={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    />
  );
}
