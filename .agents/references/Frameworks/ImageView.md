# ImageView

**Source:** [`packages/Frameworks/View/ImageView/Image.tsx`](../../../packages/Frameworks/View/ImageView/Image.tsx) and [`Image.types.ts`](../../../packages/Frameworks/View/ImageView/Image.types.ts)

`ImageView` is UIKit's image primitive. It supports a single image, a gallery, optional navigation controls, and an image dialog. Use it instead of a native `img` so radius and dialog behaviour remain consistent.

## Input shapes

- `src: string` renders one image; use `alt` for meaningful alternative text.
- `src: string[]` renders a group; `alt`, `width`, and `height` may also be arrays aligned by index.
- `src: ImageItem[]` supplies stable `id`, `src`, required `alt`, optional `srcDialog`, and optional `blurDataURL` per image.

`width` and `height` accept UIKit size values. `groupWidth`, `groupHeight`, `groupGap`, and `groupClassName` configure the multi-image layout. `priority` should be reserved for above-the-fold imagery.

## Gallery and dialog

`control` enables previous/next controls; each side can be disabled or receive a class/style slot. `overlay` accepts one node or a node per image. The `dialog` object enables the full-screen viewer and separately configures overlay, header content, controls, and footer content/list/counter.

```tsx
import { ImageView } from "@musecat/uikit";

const images = [
  { id: 1, src: "/gallery/one.jpg", alt: "First gallery image" },
  { id: 2, src: "/gallery/two.jpg", alt: "Second gallery image" },
];

export function Gallery() {
  return (
    <ImageView
      src={images}
      radius="Regular"
      groupGap={8}
      control
      dialog={{ footer: { list: true, counter: true } }}
    />
  );
}
```
