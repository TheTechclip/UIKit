# Color tokens

**Source:** [`packages/styles/_color.scss`](../../../packages/styles/_color.scss)

UIKit's color system has two layers. Primitive palette variables are stable RGB values; semantic base variables are aliases that change with `data-color-mode`. Components should request colors through `ThemeSystemProps` (`background`, `color`, `border`, or `themePreset`) rather than write palette CSS directly.

## Primitive palette

Every palette family provides levels `1` through `6`: `Pink`, `Red`, `Brown`, `Orange`, `Yellow`, `Green`, `Mint`, `Cyan`, `Blue`, `Indigo`, `Purple`, and `Magenta`. The CSS form is `--color-{family}-{level}`, for example `--color-blue-4`. `BaseLight` and `BaseDark` are also primitive six-level families.

Levels are ordered from lighter/brighter (`1`) to darker/more saturated (`6`). They are implementation tokens, not semantic text/background choices; prefer `Base` or a Theme paint where the value should follow color mode.

## Semantic base aliases and color modes

`[data-color-mode="light"]` and `[data-color-mode="dark"]` set the following aliases:

| Token family                   | Light mode              | Dark mode              |
| ------------------------------ | ----------------------- | ---------------------- |
| `--color-base-{1..6}`          | `BaseLight`             | `BaseDark`             |
| `--color-base-reversed-{1..6}` | `BaseDark`              | `BaseLight`            |
| `--color-text-base`            | dark text               | light text             |
| `--color-icon-base`            | dark icon               | light icon             |
| `--color-border-base`          | dark border             | light border           |
| `--color-background-base`      | system-light background | system-dark background |

The root defaults to light mode. `ThemeBootstrapper` updates the root `data-color-mode` attribute; a component may set its own `data-color-mode` to intentionally create a local inversion.

## Correct usage

```tsx
import { Text, View } from "@musecat/uikit";

export function StatusCard() {
  return (
    <View background="Base1" border="Light" padding={16} radius="Regular">
      <Text color="Blue4" type="Body">
        Saved
      </Text>
    </View>
  );
}
```

Do not introduce hex, RGB, or one-off alpha values in component styles. For translucent component surfaces use the supported paint syntax, for example `Base2TP4`, rather than `color-mix` in a component.
