# Theme utility classes

**Source:** [`packages/styles/_theme.scss`](../../../packages/styles/_theme.scss) and [`packages/frameworks/Theme/Theme.types.ts`](../../../packages/frameworks/Theme/Theme.types.ts)

Theme utilities are generated from design tokens. `View`, `Pressable`, and most higher-level components call `resolveThemeClasses`; application code should normally use their props instead of manually composing class names.

## Paint grammar

`ThemePaint` is `{Color}{Level}` or `{Color}{Level}TP{Transparency}`. `Color` is `Base`, `BaseLight`, `BaseDark`, `Reversed`, or a palette family; both numeric suffixes range from `1` to `6`.

- `background="Base2"` produces a `ThemeBg-Base2` surface.
- `color="Reversed1"` produces a `ThemeColor-Reversed1` foreground.
- `background="Blue3TP4"` uses the generated transparent background variant.
- `[idle, hover, active]` background tuples explicitly control interactive states; the tuple is applied only when the component is interactive and not disabled/read-only.

## Presets

`themePreset` combines a background and foreground. `UIPrimary` and `UISecondary` are the standard interactive presets; their `Reversed` variants invert the base family. `{Color}Full` and `{Color}Soft` generate palette-based surfaces. Use `themeInteractive` on an interactive primitive when hover/active feedback is required.

## Borders, shadows, blur, and radius

| Concern | Prop value | Result |
| --- | --- | --- |
| Border | `"Light"`, `"Regular"`, `"Bold"` | Uses the default `Base6TP1` paint. |
| Explicit border | `"Blue3"` or `["Blue3", "Light"]` | Applies the selected paint and width. |
| Directional border | `["Light", "None", "Light", "None"]` | Maps to top, right, bottom, left in order. |
| Shadow | `"Light"`, `"Regular"`, `"Bold"` | Emits `ThemeShadow-1`, `-2`, or `-3`. |
| Blur | `"ExtraLight"` through `"Heavy"` | Emits a backdrop-filter utility. |
| Radius | `"None"` through `"Heavy"`, `"Circle"` | Resolves through `Radius()` and the radius CSS variables. |

`None` explicitly clears a supported border, shadow, blur, or radius. Keep explicit zero/`None` values intact when forwarding component props.

## Generated class contracts

- `.ThemeBg-{Paint}` sets `background` and holds the current value in `--theme-bg`.
- `.ThemeColor-{Paint}` sets `color` and descendant `stroke`.
- `.ThemeBorder-{Paint}-{Width}` applies all sides; directional forms use `ThemeBorder1` through `ThemeBorder4`.
- `.ThemeInteractive` enables hover/active feedback only on eligible elements.
- `.ThemeDisabled` and `.ThemeReadonly` communicate state to the utility system.

Do not use raw color or radius declarations to bypass these contracts.
