"use client";

import NextImage from "next/image";
import View from "../../View";
import { resolveImageSrc, resolveOverlay } from "../Image.resolve";
import type { ImageItem, ImageOverlay } from "../Image.types";

export interface DialogImageSlideProps {
  item: ImageItem;
  index: number;
  initialIndex: number;
  priority?: boolean;
  dialogOverlay?: ImageOverlay;
  className?: string;
}

export function DialogImageSlide({
  item,
  index,
  initialIndex,
  priority,
  dialogOverlay,
  className,
}: DialogImageSlideProps) {
  return (
    <View
      alignItems="center"
      justifyContent="center"
      style={{
        flex: "0 0 100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <NextImage
        fill
        sizes="auto"
        priority={priority && index === initialIndex}
        src={resolveImageSrc(item, "dialog")}
        alt={item.alt}
        draggable={false}
        className={className}
        style={{
          objectFit: "contain",
          objectPosition: "center",
          userSelect: "none",
        }}
      />
      {resolveOverlay(dialogOverlay, index) && (
        <View
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          {resolveOverlay(dialogOverlay, index)}
        </View>
      )}
    </View>
  );
}
