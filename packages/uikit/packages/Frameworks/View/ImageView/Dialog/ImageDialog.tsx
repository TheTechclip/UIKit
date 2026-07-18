"use client";

import { useEffect, useRef } from "react";
import { DialogImageFooter } from "./ImageDialog.footer";
import { DialogImageHeader } from "./ImageDialog.header";
import { DialogImageSlide } from "./ImageDialog.slide";
import {
  ImageLeftControl,
  ImageRightControl,
} from "../Image.controls";
import { useImageDialog } from "../Image.hooks";
import type {
  ImageItem,
  ImageProps,
} from "../Image.types";
import View from "../../View";

export type ImageDialogProps = {
  items: ImageItem[];
  initialIndex: number;
  dialog: NonNullable<ImageProps["dialog"]>;
  priority?: boolean;
  className?: string;
  onClose: () => void;
};

export default function ImageDialog({
  items,
  initialIndex,
  dialog,
  priority,
  className,
  onClose,
}: ImageDialogProps) {
  const {
    galleryRef,
    selectedIndex,
    scrollTo,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
  } = useImageDialog(initialIndex);

  const thumbnailRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    thumbnailRefs.current[selectedIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [selectedIndex]);

  return (
    <View
      column
      width="100%"
      height="100%"
      background="BaseDark1"
      className={dialog.className}
      style={{
        position: "relative",
        minWidth: 0,
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <DialogImageHeader config={dialog.header} onClose={onClose} />

      {dialog.control &&
        (() => {
          const control = dialog.control;
          const renderLeft =
            typeof control === "boolean"
              ? control
              : control.left !== false && control.left !== undefined;
          const renderRight =
            typeof control === "boolean"
              ? control
              : control.right !== false && control.right !== undefined;
          const leftSlot =
            typeof control === "object" && typeof control.left === "object"
              ? control.left
              : {};
          const rightSlot =
            typeof control === "object" && typeof control.right === "object"
              ? control.right
              : {};
          return (
            <View
              data-color-mode="dark"
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                zIndex: 2,
              }}
            >
              {renderLeft && (
                <ImageLeftControl
                  onClick={scrollPrev}
                  disabled={!canScrollPrev}
                  className={leftSlot.className}
                  style={{
                    position: "absolute",
                    left: "1.6rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "auto",
                    ...leftSlot.style,
                  }}
                />
              )}
              {renderRight && (
                <ImageRightControl
                  onClick={scrollNext}
                  disabled={!canScrollNext}
                  className={rightSlot.className}
                  style={{
                    position: "absolute",
                    right: "1.6rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "auto",
                    ...rightSlot.style,
                  }}
                />
              )}
            </View>
          );
        })()}

      <View
        ref={galleryRef}
        fullWidth
        padding={32}
        style={{ height: "100%", minHeight: 0, overflow: "hidden" }}
      >
        <View
          fullWidth
          style={{
            display: "flex",
            height: "100%",
            touchAction: "pan-y pinch-zoom",
          }}
        >
          {items.map((item, index) => (
            <DialogImageSlide
              key={item.id}
              item={item}
              index={index}
              initialIndex={initialIndex}
              priority={priority}
              dialogOverlay={dialog.overlay}
              className={className}
            />
          ))}
        </View>
      </View>

      <DialogImageFooter
        dialog={dialog}
        items={items}
        selectedIndex={selectedIndex}
        thumbnailRefs={thumbnailRefs}
        scrollTo={scrollTo}
        scrollPrev={scrollPrev}
        scrollNext={scrollNext}
        canScrollPrev={canScrollPrev}
        canScrollNext={canScrollNext}
      />
    </View>
  );
}
