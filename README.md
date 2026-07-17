# @musecat/uikit

A Next.js 16 + React 19 + TypeScript UI Design component library.

## Installation

```bash
npm install @musecat/uikit
```

## Usage

Built with `View` and `Pressable` layout primitives.

```tsx
import { View, Pressable, ImageView } from "@musecat/uikit";

export default function Example() {
  return (
    <View column gap={16} padding={24} radius="Regular" background="BaseLight2">
      <ImageView src="/avatar.png" radius="Circle" width={48} height={48} />

      <Pressable
        radius="Bold"
        background={["BaseFull", "BaseFull", "Base1TP2"]}
        padding={12}
        align="center"
        justify="center"
      >
        <View typography="Button1" color="ReversedBaseFull">
          Action
        </View>
      </Pressable>
    </View>
  );
}
```

## References

This package includes `.agents/references/` directory with detailed documentation for every component, framework, and style system. Use it alongside TypeScript definitions as a guide when building with `@musecat/uikit`.

## Acknowledgements

- [Motion (Framer Motion)](https://motion.dev/)
- [dnd-kit](https://dndkit.com/)
- [Embla Carousel](https://www.embla-carousel.com/)
- [figma-squircle](https://github.com/phamfoo/figma-squircle)
- [Sonner](https://sonner.emilkowal.ski/)
- [es-hangul](https://es-hangul.toss.im/)
- [MapLibre GL JS](https://maplibre.org/)

Built with [tsup](https://tsup.egoist.dev/) and [TypeScript](https://www.typescriptlang.org/).

## License

[MIT License](./LICENSE) © Musecat Team.
