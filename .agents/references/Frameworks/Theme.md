# Theme framework

**Sources:** [`Theme.types.ts`](../../../packages/Frameworks/Theme/Theme.types.ts), [`Radius.types.ts`](../../../packages/Frameworks/Theme/Radius.types.ts), [`Theme.boot.tsx`](../../../packages/Frameworks/Theme/Theme.boot.tsx), and [`_theme.scss`](../../../packages/Styles/_theme.scss)

The Theme framework converts typed design-token props into generated CSS utility classes. It also exposes the client-side color-scheme context used by Next.js applications. It does not replace the global SCSS importer: the generated classes and variables require the UIKit styles to be loaded.

## Paints and presets

`ThemePaint` is a color family plus level: `Base1`, `Reversed4`, `Blue2`, or a transparent variant such as `Base1TP3`. `ThemeBackgroundPaint` may be one paint or a tuple of `[idle]` or `[idle, hover, active]`. Three-state tuples take effect only for eligible interactive components.

`ThemePreset` supports `UIPrimary`, `UISecondary`, their `Reversed` aliases, and `{Color}Full`/`{Color}Soft` combinations. Explicit `background` and `color` win over a preset's resolved values. A selected component without a preset resolves to `UISecondary`.

## Borders, shadows, blur, and radius

```ts
type ThemeBorderWidth = "None" | "Light" | "Regular" | "Bold";
type ThemeShadow = "Light" | "Regular" | "Bold" | "None";
type BackgroundBlurValue =
  "ExtraLight" | "Light" | "Regular" | "Bold" | "ExtraBold" | "Heavy" | "None";
type RadiusScale =
  "None" | "ExtraLight" | "Light" | "Regular" | "Bold" | "ExtraBold" | "Heavy" | "Circle";
```

`border` accepts a width, a paint, `[paint, width]`, or one-to-four directional widths. A width-only border uses `Base6TP1`. `Radius()` accepts a token, size value, or one-to-four directional values and resolves numeric values through `Size()`. `Circle` is valid anywhere a directional radius value is accepted.

`resolveThemeClasses()` is public for framework authors. It returns classes only; it does not mutate DOM. Higher-level components should pass their actual disabled/read-only/interactive state so hover feedback is not enabled for unavailable controls.

## Theme scheme context

```ts
type ThemeScheme = "system" | "light" | "dark";
type ResolvedThemeScheme = "light" | "dark";

function ThemeBootstrapper(props: {
  children: React.ReactNode;
  initialTheme?: ThemeScheme;
}): React.ReactElement;

function useTheme(): {
  theme: ThemeScheme;
  setTheme(theme: ThemeScheme): void;
  resolvedTheme: ResolvedThemeScheme;
  themes: readonly ThemeScheme[];
};
```

The provider reads/writes the `theme` local-storage key and a one-year `theme` cookie. It tracks `(prefers-color-scheme: dark)` for the `system` choice and updates the document root's `data-theme`, `data-color-mode`, and `colorScheme`. `isThemeScheme()` validates a cookie value; `resolveThemeScheme()` returns only an explicit `light`/`dark` selection for server markup.

For App Router, read the cookie in the server layout, validate it, set explicit root attributes only when the choice is light/dark, and pass the selection to a client `ThemeBootstrapper`. A `system` server choice has no server-resolvable mode and is finalized after hydration. This follows UIKit's bootstrap naming convention: root-level setup components are `DialogBootstrap`, `ToasterBootstrap`, and `ThemeBootstrapper`; the React context remains an internal implementation detail.

## Example

```tsx
import { Pressable, Text, ThemeBootstrapper, View, useTheme } from "@musecat/uikit";

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Pressable
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      padding={12}
      radius="Regular"
      themePreset="UISecondary"
      themeInteractive
    >
      <Text type="Body">Toggle theme</Text>
    </Pressable>
  );
}

export function AppShell() {
  return (
    <ThemeBootstrapper>
      <View padding={24} background="Base1">
        <ThemeToggle />
      </View>
    </ThemeBootstrapper>
  );
}
```
