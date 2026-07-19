"use client";

import NextImage from "next/image";
import { useCallback, useMemo, useState } from "react";
import Dialog from "../../Dialog/Dialog";
import Pressable from "../../Pressable/Pressable";
import type { UIKitSizeValue } from "../../shared/sizing";
import HScrollView from "../HScrollView/HScrollView";
import View from "../View";
import ImageDialog from "./Dialog/ImageDialog";
import { ImageLeftControl, ImageRightControl } from "./Image.controls";
import {
  resolveAtIndex,
  resolveBlurDataURL,
  resolveImageSrc,
  resolveItems,
  resolveOverlay,
} from "./Image.resolve";
import type { ImageItem, ImageOverlay, ImageProps } from "./Image.types";

const DEFAULT_GROUP_WIDTH = "auto";
const DEFAULT_GROUP_HEIGHT = "29rem";

const PRESSABLE_STYLE: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
};
const OVERLAY_STYLE: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
};
const IMG_STYLE: React.CSSProperties = {
  height: "100%",
  objectFit: "cover",
  objectPosition: "center",
  display: "block",
};
const NEXT_IMG_STYLE: React.CSSProperties = {
  objectFit: "cover",
  objectPosition: "center",
};

function ImageGroupItem({
  item,
  index,
  dialog,
  className,
  radius,
  width,
  height,
  overlay,
  groupWidth,
  priority,
  openDialog,
}: {
  item: {
    id: number;
    src: string;
    alt: string;
    srcDialog?: string;
    blurDataURL?: string;
  };
  index: number;
  dialog?: ImageProps["dialog"];
  className?: string;
  radius?: import("../../Theme/Radius.types").RadiusValue;
  width?: UIKitSizeValue | UIKitSizeValue[];
  height?: UIKitSizeValue | UIKitSizeValue[];
  overlay?: ImageOverlay;
  groupWidth?: string;
  priority?: boolean;
  openDialog: (index: number) => void;
}) {
  const resolvedWidth = resolveAtIndex(width, index);
  const resolvedHeight = resolveAtIndex(height, index);
  const resolvedOverlay = resolveOverlay(overlay, index);

  return (
    <Pressable
      key={item.id}
      radius={radius ?? "Regular"}
      background="Base3"
      onClick={dialog ? () => openDialog(index) : undefined}
      style={PRESSABLE_STYLE}
      width={resolvedWidth ?? "fit-content"}
      height={resolvedHeight}
    >
      {(resolvedWidth ?? groupWidth) === "auto" ? (
        <img
          src={resolveImageSrc(item, "inline")}
          alt={item.alt}
          draggable={false}
          className={className}
          style={IMG_STYLE}
        />
      ) : (
        <NextImage
          fill
          priority={priority && index === 0}
          src={resolveImageSrc(item, "inline")}
          alt={item.alt}
          placeholder="blur"
          blurDataURL={resolveBlurDataURL(item, index)}
          draggable={false}
          className={className}
          style={NEXT_IMG_STYLE}
        />
      )}
      {resolvedOverlay && <View style={OVERLAY_STYLE}>{resolvedOverlay}</View>}
    </Pressable>
  );
}

export default function Image({
  src,
  radius,
  alt,
  width,
  height,
  priority,
  className,
  groupWidth = DEFAULT_GROUP_WIDTH,
  groupHeight = DEFAULT_GROUP_HEIGHT,
  groupGap = 16,
  groupClassName,
  overlay,
  control,
  dialog,
}: ImageProps) {
  const items = useMemo(() => resolveItems(src, alt), [src, alt]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogIndex, setDialogIndex] = useState(0);

  const openDialog = useCallback((index: number) => {
    setDialogIndex(index);
    setDialogOpen(true);
  }, []);

  const openDialogZero = useCallback(() => openDialog(0), [openDialog]);
  const closeDialog = useCallback(() => setDialogOpen(false), []);

  const controlsRenderer = useMemo(() => {
    if (!control) return undefined;
    return ({
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
    }: {
      scrollPrev: () => void;
      scrollNext: () => void;
      canScrollPrev: boolean;
      canScrollNext: boolean;
    }) => {
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
          gap={8}
          width="100%"
          className={
            typeof control === "object" ? control.groupClassName : undefined
          }
          style={typeof control === "object" ? control.groupStyle : undefined}
        >
          {renderLeft && (
            <ImageLeftControl
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={leftSlot.className}
              style={{ zIndex: 2, ...leftSlot.style }}
            />
          )}
          {renderRight && (
            <ImageRightControl
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={rightSlot.className}
              style={{ zIndex: 2, ...rightSlot.style }}
            />
          )}
        </View>
      );
    };
  }, [control]);

  if (items.length === 0) return null;

  if (items.length === 1) {
    const item = items[0] as ImageItem;
    const resolvedWidth = resolveAtIndex(width, 0);
    const resolvedHeight = resolveAtIndex(height, 0);
    const resolvedOverlay = resolveOverlay(overlay, 0);

    if (dialog) {
      return (
        <>
          {}
          <Pressable
            radius={radius ?? "Regular"}
            onClick={openDialogZero}
            style={PRESSABLE_STYLE}
            width={resolvedWidth ?? "fit-content"}
            height={resolvedHeight}
          >
            {}
            {(resolvedWidth ?? "auto") === "auto" ? (
              <img
                src={resolveImageSrc(item, "inline")}
                alt={item.alt}
                draggable={false}
                className={className}
                style={{
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            ) : (
              <NextImage
                fill
                priority={priority}
                src={resolveImageSrc(item, "inline")}
                alt={item.alt}
                placeholder="blur"
                blurDataURL={resolveBlurDataURL(item, 0)}
                draggable={false}
                className={className}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                }}
              />
            )}

            {}
            {resolvedOverlay && (
              <View
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                }}
              >
                {resolvedOverlay}
              </View>
            )}
          </Pressable>

          {}
          <Dialog
            mode="modal"
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            modal={{
              immersive: true,
              exit: { overlay: false, escape: true },
              custom: (
                <ImageDialog
                  items={items}
                  initialIndex={dialogIndex}
                  dialog={dialog}
                  priority={priority}
                  className={className}
                  onClose={closeDialog}
                />
              ),
            }}
          />
        </>
      );
    }

    return (
      <View
        radius={radius ?? "Regular"}
        style={PRESSABLE_STYLE}
        width={resolvedWidth ?? "fit-content"}
        height={resolvedHeight}
      >
        {}
        {(resolvedWidth ?? "auto") === "auto" ? (
          <img
            src={resolveImageSrc(item, "inline")}
            alt={item.alt}
            draggable={false}
            className={className}
            style={IMG_STYLE}
          />
        ) : (
          <NextImage
            fill
            priority={priority}
            src={resolveImageSrc(item, "inline")}
            alt={item.alt}
            placeholder="blur"
            blurDataURL={resolveBlurDataURL(item, 0)}
            draggable={false}
            className={className}
            style={NEXT_IMG_STYLE}
          />
        )}

        {}
        {resolvedOverlay && (
          <View style={OVERLAY_STYLE}>{resolvedOverlay}</View>
        )}
      </View>
    );
  }

  return (
    <>
      {}
      <View column gap={10} fullWidth className={groupClassName}>
        <HScrollView
          active
          gap={groupGap}
          itemWidth={groupWidth}
          itemHeight={groupHeight}
          showEdgeEffect={false}
          renderControls={controlsRenderer}
        >
          {items.map((item, index) => (
            <ImageGroupItem
              key={item.id}
              item={item}
              index={index}
              dialog={dialog}
              className={className}
              radius={radius}
              width={width}
              height={height}
              overlay={overlay}
              groupWidth={groupWidth}
              priority={priority}
              openDialog={openDialog}
            />
          ))}
        </HScrollView>
      </View>

      {}
      {dialog && (
        <Dialog
          mode="modal"
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          modal={{
            immersive: true,
            exit: { overlay: false, escape: true },
            custom: (
              <ImageDialog
                items={items}
                initialIndex={dialogIndex}
                dialog={dialog}
                priority={priority}
                className={className}
                onClose={closeDialog}
              />
            ),
          }}
        />
      )}
    </>
  );
}
