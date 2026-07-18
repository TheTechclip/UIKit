# Shared framework utilities

**Sources:** [`packages/Frameworks/_shared`](../../../packages/Frameworks/_shared)

## Purpose

The `_shared` framework folder is a module that collects utility functions, hooks, constants, and shared types commonly depended on by multiple frameworks or components. It includes size conversion, layer constants, scroll lock handling, share layout type definitions, etc.

## Usage Logic

- **sizing.ts**: Consistently parses numeric or string size values like `16`, `"1rem"`, `"16px"` and converts them to CSS values (`Size`, `SizePX` functions).
- **Padding.types.ts**: Utilities for handling multi-directional padding (vertical/horizontal, single).
- **useControllableState.ts**: A custom hook to support both controlled and uncontrolled component states.
- **layer.constants.ts**: Provides global Z-index layer constants (`LAYER_Z_INDEX`).
- **Wind.types.ts**: Shared layout props (`width`, `height`, `margin`, `gap`, `alignItems`, `justifyContent`, `alignSelf`, `column`, `row`, `fullWidth`, `opacity`, `noSquircle`) used by both `ViewProps` and `PressableProps`.
- **bodyScrollLock.ts**: Implements touch and mouse scroll lock.
- **normalize.ts**: Image src, brand icon class, and language name normalization utilities.

## Ownership boundary

These files are implementation infrastructure. Only symbols re-exported by the root `index.ts` are supported package APIs: `Size`, `SizePX`, `useControllableState`, `useScrollLock`, `LAYER_Z_INDEX`, and normalization helpers. Import other files directly only from UIKit source, not from consuming applications.

## Type Signatures

```typescript
// sizing.ts
export type UIKitSizeValue = number | string;
export function Size(value?: UIKitSizeValue | null): string | number | undefined;
export function SizePX(value: UIKitSizeValue | undefined, fallback: number, rootFontSize?: number): number;

// useControllableState.ts
export function useControllableState<T>(options: { value?: T; defaultValue: T }): const [T, (nextValue: T | ((prevValue: T) => T)) => void, boolean];

// layer.constants.ts
export const LAYER_Z_INDEX: { popover: number, modal: number, /* ... */ };

// Wind.types.ts
export interface WindProps {
  width?: number | string;
  height?: number | string;
  margin?: number | string;
  gap?: number | string;
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  alignSelf?: CSSProperties["alignSelf"];
  column?: boolean;
  row?: boolean;
  fullWidth?: boolean;
  opacity?: number;
  noSquircle?: boolean;
}

// bodyScrollLock.ts
export function useScrollLock(locked?: boolean): { lockScroll: () => void, openScroll: () => void };
```

## Example Code

```tsx
import { Size } from "@musecat/uikit";
import { useScrollLock } from "@musecat/uikit";
import { useControllableState } from "@musecat/uikit";

function MyComponent({ value, defaultValue, width }) {
  // Scroll lock
  useScrollLock(true);

  // Size normalization: 16 -> "1.6rem"
  const widthStyle = Size(width);

  // State management (controlled or uncontrolled)
  const [current, setCurrent] = useControllableState({ value, defaultValue });

  return (
    <div style={{ width: widthStyle }}>
      <button onClick={() => setCurrent(!current)}>Toggle</button>
    </div>
  );
}
```
