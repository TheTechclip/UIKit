"use client";

import type { MutableRefObject } from "react";
import View from "../../View";
import type { ImageItem, ImageProps } from "../Image.types";
import { DialogImageCounter } from "./ImageDialog.counter";
import { DialogImageList } from "./ImageDialog.list";

export interface DialogImageFooterProps {
  dialog: NonNullable<ImageProps["dialog"]>;
  items: ImageItem[];
  selectedIndex: number;
  thumbnailRefs: MutableRefObject<(HTMLElement | null)[]>;
  scrollTo: (index: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
}

export function DialogImageFooter({
  dialog,
  items,
  selectedIndex,
  thumbnailRefs,
  scrollTo,
  scrollPrev,
  scrollNext,
  canScrollPrev,
  canScrollNext,
}: DialogImageFooterProps) {
  void scrollPrev;
  void scrollNext;
  void canScrollPrev;
  void canScrollNext;
  if (!dialog.footer) return null;

  const selectedItem = items[selectedIndex];

  return (
    <View
      column
      gap={12}
      className={dialog.footer.className}
      style={{
        position: "absolute",
        left: "1.6rem",
        right: "1.6rem",
        bottom: "1.6rem",
        zIndex: 2,
        ...dialog.footer.style,
      }}
    >
      {selectedItem && dialog.footer.content?.(selectedItem, selectedIndex)}

      <View alignItems="flex-end" justifyContent="space-between" gap={12}>
        {dialog.footer.list && (
          <DialogImageList
            items={items}
            selectedIndex={selectedIndex}
            thumbnailRefs={thumbnailRefs}
            onThumbnailClick={scrollTo}
          />
        )}

        <View alignItems="center" gap={8} style={{ flexShrink: 0 }}>
          {dialog.footer.counter && (
            <DialogImageCounter
              selectedIndex={selectedIndex}
              total={items.length}
            />
          )}
        </View>
      </View>
    </View>
  );
}
