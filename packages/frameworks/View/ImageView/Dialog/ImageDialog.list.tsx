"use client";

import NextImage from "next/image";
import type { MutableRefObject } from "react";
import Pressable from "../../../Pressable/Pressable";
import View from "../../View";
import styles from "../Image.module.scss";
import { resolveBlurDataURL, resolveImageSrc } from "../Image.resolve";
import type { ImageItem } from "../Image.types";

export interface DialogImageListProps {
  items: ImageItem[];
  selectedIndex: number;
  thumbnailRefs: MutableRefObject<(HTMLElement | null)[]>;
  onThumbnailClick: (index: number) => void;
}

export function DialogImageList({
  items,
  selectedIndex,
  thumbnailRefs,
  onThumbnailClick,
}: DialogImageListProps) {
  if (items.length <= 1) return null;

  return (
    <View
      style={{
        overflowX: "auto",
        scrollbarWidth: "none",
        flex: 1,
        minWidth: 0,
      }}
      gap={8}
    >
      {items.map((item, index) => (
        <Pressable
          key={item.id}
          ref={(el) => {
            thumbnailRefs.current[index] = el;
          }}
          data-active={selectedIndex === index ? "true" : "false"}
          onClick={() => onThumbnailClick(index)}
          opacity={selectedIndex === index ? 1 : 0.4}
          className={styles.ThumbnailButton}
          style={{ flexShrink: 0 }}
          radius="ExtraLight"
        >
          <View
            style={{
              position: "relative",
              width: "4.8rem",
              height: "4.8rem",
              overflow: "hidden",
            }}
          >
            <NextImage
              fill
              src={resolveImageSrc(item, "inline")}
              alt=""
              placeholder="blur"
              blurDataURL={resolveBlurDataURL(item, index)}
              draggable={false}
              style={{ objectFit: "cover" }}
            />
          </View>
        </Pressable>
      ))}
    </View>
  );
}
