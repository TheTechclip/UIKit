# ImageView

**Source:** [`packages/frameworks/View/ImageView/Image.tsx`](../../../packages/frameworks/View/ImageView/Image.tsx) and [`Image.types.ts`](../../../packages/frameworks/View/ImageView/Image.types.ts)

`ImageView` is UIKit's image primitive. It supports a single image, a gallery, optional navigation controls, and an image dialog. Use it instead of a native `img` so radius and dialog behaviour remain consistent.

## Input shapes

- `src: string` renders one image; use `alt` for meaningful alternative text.
- `src: string[]` renders a group; `alt`, `width`, and `height` may also be arrays aligned by index.
- `src: ImageItem[]` supplies stable `id`, `src`, required `alt`, optional intrinsic `width`/`height`, `srcDialog`, and `blurDataURL` per image.

`width` and `height` accept UIKit size values. `groupWidth`, `groupHeight`, `groupGap`, and `groupClassName` configure the multi-image layout. `priority` should be reserved for above-the-fold imagery.

`renderer` selects the implementation independently of layout: it defaults to Next.js `Image` and accepts `"next"` or `"native"`. Use `renderer="native"` when a native `<img>` is required.

When using the default Next.js renderer, provide intrinsic `width` and `height` on `ImageItem` when available. Otherwise the image uses `fill` and follows its parent layout.

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
