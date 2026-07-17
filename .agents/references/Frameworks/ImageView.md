# ImageView Framework

## Purpose

The `ImageView` framework is a composite component that renders (single and multiple) images optimally and provides a full-screen or popup modal zoom/slide view (gallery) on click. Internally supports Next.js's `next/image`, and uses `embla-carousel` in slide mode.

## Usage Logic

- Passing a single string to `src` renders one image; passing an array (`string[]` or `ImageItem[]`) displays it as a horizontally scrolling gallery.
- Passing the `dialog` prop opens an immersive image viewer as a modal based on the `Dialog` framework when the image is clicked.
- Includes its own blur data generation utility (fallback blur) to provide a natural placeholder during loading.

## Type Signatures

```typescript
export type ImageItem = {
  id: number;
  src: string;
  alt: string;
  srcDialog?: string; // high-quality image to show in dialog mode
  blurDataURL?: string;
};

export interface ImageProps extends RadiusProps {
  src: string | string[] | ImageItem[];
  alt?: string | string[];
  width?: number | string | (number | string)[];
  height?: number | string | (number | string)[];
  priority?: boolean;
  groupWidth?: string;
  groupHeight?: string;
  groupGap?: number | string;
  overlay?: ReactNode | ReactNode[];
  control?: boolean | { left?: boolean; right?: boolean /* ... */ };
  dialog?: {
    overlay?: ReactNode | ReactNode[];
    header?: { content?: ReactNode };
    footer?: { list?: boolean; counter?: boolean /* ... */ };
  };
}
```

## Example Code

```tsx
import { View } from "@musecat/uikit";

function PhotoGallery() {
  const images = [
    { id: 1, src: "/img1.jpg", alt: "Photo 1" },
    { id: 2, src: "/img2.jpg", alt: "Photo 2" },
  ];

  return (
    <ImageView
      src={images}
      radius="R12"
      groupWidth="240px"
      groupHeight="160px"
      control={{ left: true, right: true }}
      dialog={{
        footer: { list: true, counter: true },
      }}
    />
  );
}
```
