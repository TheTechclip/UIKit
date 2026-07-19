import type { CSSProperties, ReactNode } from "react";
import type { UIKitSizeValue } from "../../shared/sizing";
import type { RadiusProps } from "../../Theme/Radius.types";

export type ImageItem = {
  id: number;
  src: string;
  alt: string;
  srcDialog?: string;
  blurDataURL?: string;
};

export type ImageControlSlot = {
  className?: string;
  style?: CSSProperties;
};

export type ImageOverlay = ReactNode | ReactNode[];

export interface ImageProps extends RadiusProps {
  src: string | string[] | ImageItem[];

  alt?: string | string[];

  width?: UIKitSizeValue | UIKitSizeValue[];

  height?: UIKitSizeValue | UIKitSizeValue[];

  priority?: boolean;

  className?: string;

  groupWidth?: string;
  groupHeight?: string;
  groupGap?: UIKitSizeValue;
  groupClassName?: string;

  overlay?: ImageOverlay;

  control?:
    | boolean
    | {
        left?: ImageControlSlot | boolean;
        right?: ImageControlSlot | boolean;
        groupClassName?: string;
        groupStyle?: CSSProperties;
      };

  dialog?: {
    className?: string;
    overlay?: ImageOverlay;
    header?: {
      className?: string;
      style?: CSSProperties;
      content?: ReactNode;
    };
    control?:
      | boolean
      | {
          left?: ImageControlSlot | boolean;
          right?: ImageControlSlot | boolean;
        };
    footer?: {
      className?: string;
      style?: CSSProperties;
      content?: (item: ImageItem, index: number) => ReactNode;
      list?: boolean;
      counter?: boolean;
    };
  };
}
