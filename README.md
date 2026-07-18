# @musecat/uikit

UIKit is a source-distributed React component library for Next.js 16 and React 19. It provides token-driven layout primitives, form controls, overlays, motion helpers, and SCSS utilities. The public package entry point is [`index.ts`](./index.ts); import application-facing APIs only from `@musecat/uikit`.

## Install and configure Next.js

```bash
npm install @musecat/uikit @musecat/functionkit
npm install -D sass
```

The package ships TypeScript and SCSS source, so Next.js must transpile it:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@musecat/uikit", "@musecat/functionkit"],
};

export default nextConfig;
```

Import the global stylesheet entry once from the application's root stylesheet or layout. It supplies color, typography, theme, reset, and viewport utility rules.

```scss
@use "@musecat/uikit/packages/Styles/importer";
```

## Core primitives

Use `View` for structure and `Pressable` for interaction. Both primitives are flex containers, accept token-aware layout and theme props, and use `Squircle` clipping when `radius` is supplied. Use `ImageView` for images rather than a native `img` element.

```tsx
import { ImageView, Pressable, Text, View } from "@musecat/uikit";

export function ProfileAction() {
  return (
    <View column gap={16} padding={24} radius="Regular" background="Base1" border="Light">
      <ImageView src="/avatar.png" alt="Profile" width={48} height={48} radius="Circle" />

      <Pressable
        padding={12}
        radius="Bold"
        themePreset="UIPrimary"
        themeInteractive
        justifyContent="center"
        aria-label="Continue"
      >
        <Text type="Body">Continue</Text>
      </Pressable>
    </View>
  );
}
```

Numeric spacing and dimensions are converted through UIKit's sizing utility. Use design tokens such as `Base1`, `UIPrimary`, and `Regular` instead of hard-coded colors, radii, or component-local CSS values.

For route-level composition, use `Layout` once as the page shell, `Layout.Grid` for multi-column content, and `Layout.Section` for titled grid blocks. Keep cards, stacks, and local alignment inside `View`; see the [Layout reference](./.agents/references/Components/Layout.md) for grouping, responsive ordering, and background-image behaviour.

## Theme scheme in App Router

`ThemeBootstrapper` is a client bootstrap component. It persists `system`, `light`, or `dark`, follows OS changes for `system`, and sets `html[data-theme]`, `html[data-color-mode]`, and `color-scheme`. For a stable server render, validate the `theme` cookie in the server layout and pass it to a small client bootstrap component as `initialTheme`.

```tsx
// app/providers.tsx
"use client";

import { ThemeBootstrapper, type ThemeScheme } from "@musecat/uikit";

export function AppBootstrapper({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: ThemeScheme;
}) {
  return <ThemeBootstrapper initialTheme={initialTheme}>{children}</ThemeBootstrapper>;
}
```

## Documentation and development

Detailed source-aligned references live in [`.agents/references`](./.agents/references). Read the matching component, framework, and style references before changing UIKit. The TypeScript definitions remain the final authority for every prop and exported type.

| Command                 | Purpose                                                  |
| ----------------------- | -------------------------------------------------------- |
| `npm test`              | Run the Vitest suite.                                    |
| `npm run typecheck`     | Type-check without emitting files.                       |
| `npm run lint`          | Run Biome checks.                                        |
| `npm run lint:css`      | Run Stylelint on component SCSS.                         |
| `npm run test:coverage` | Produce coverage data and enforce repository thresholds. |

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution requirements and [SECURITY.md](./SECURITY.md) for vulnerability reporting.

## Acknowledgements

- [Motion](https://motion.dev/)
- [dnd-kit](https://dndkit.com/)
- [Embla Carousel](https://www.embla-carousel.com/)
- [figma-squircle](https://github.com/phamfoo/figma-squircle)
- [Sonner](https://sonner.emilkowal.ski/)
- [MapLibre GL JS](https://maplibre.org/)
- [Tiptap](https://tiptap.dev/)

## License

[MIT License](./LICENSE) © Musecat Team.
