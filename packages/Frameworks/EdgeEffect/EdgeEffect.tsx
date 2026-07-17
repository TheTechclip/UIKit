"use client";

import { memo, useMemo } from "react";
import type { EdgeEffectProps } from "@/packages/Frameworks/EdgeEffect/EdgeEffect.types";
import View from "@/packages/Frameworks/View/View";

const OPPOSITE_SIDE: Record<
  "left" | "right" | "top" | "bottom",
  "left" | "right" | "top" | "bottom"
> = {
  left: "right",
  right: "left",
  top: "bottom",
  bottom: "top",
};

const EdgeEffect = memo(function EdgeEffect({
  side = "top",
  className,
  style,
  ...restProps
}: EdgeEffectProps) {
  const oppositeSide = OPPOSITE_SIDE[side];

  const backgroundGradient = useMemo(() => {
    return `linear-gradient(to ${oppositeSide}, var(--color-base-light-1, rgba(255, 255, 255, 0.8)), transparent)`;
  }, [oppositeSide]);

  return (
    <View
      className={className}
      {...restProps}
      style={{
        pointerEvents: "none",
        ...style,
      }}
    >
      <View
        suppressHydrationWarning
        style={{
          width: "100%",
          height: "100%",
          background: backgroundGradient,
        }}
      />
    </View>
  );
});

EdgeEffect.displayName = "EdgeEffect";

export default EdgeEffect;
