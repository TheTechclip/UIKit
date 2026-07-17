"use client";

import type React from "react";
import View from "@/packages/Frameworks/View/View";

interface StopParentInteractionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  blockDefault?: boolean;
  alignItems?: "center" | "start" | "end" | "stretch";
  gap?: number;
  "data-stop-parent-interaction-state"?: boolean;
}

export default function StopParentInteraction({
  children,
  className,
  style,
  blockDefault,
  alignItems,
  gap,
  "data-stop-parent-interaction-state": dataStopState,
}: StopParentInteractionProps) {
  const handleInteraction = (event: React.MouseEvent) => {
    if (blockDefault) {
      event.preventDefault();
    }
    event.stopPropagation();
  };

  return (
    <View
      alignItems={alignItems}
      gap={gap}
      className={className}
      style={style}
      data-stop-parent-interaction-state={dataStopState}
      onMouseDown={handleInteraction}
      onClick={handleInteraction}
    >
      {children}
    </View>
  );
}
