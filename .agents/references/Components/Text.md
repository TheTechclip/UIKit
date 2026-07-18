# Text

**Source:** [`packages/Components/Text`](../../../packages/Components/Text)

## Purpose

The `Text` component is a text element for applying a unified typography system across the project. It allows applying consistent font sizes, heights, and styles.

## Usage Logic

- **Typography Tokens**: Pass a UIKit typography hierarchy (`LargeTitle`, `Body`, `Caption1`, etc.) to `type` to easily apply predefined formatting.
- **Styling Details**: Override `weight`, `color`, `textAlign`, `opacity`, `lineHeight`, etc.
- **Vertical Trim**: With `verticalTrim={true}`, `lineHeight: 1` is applied, removing top/bottom text margins for precise layout calculation.

## Type Signatures

```typescript
import type { UIKitSizeValue } from "../../Frameworks/_shared/sizing";
import type { ThemePaint } from "../../Frameworks/Theme/Theme.types";

export interface TextProps {
  "data-color-mode"?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  type?:
    | "LargeTitle"
    | "Title1"
    | "Title2"
    | "Title3"
    | "Headline"
    | "Callout"
    | "Body"
    | "Subheadline"
    | "Footnote"
    | "Caption1"
    | "Caption2"
    | "Coding"
    | "Pre";
  color?: ThemePaint;
  lineHeight?: number;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  letterSpacing?: number;
  size?: UIKitSizeValue;
  verticalTrim?: boolean;
  fontType?: "serif" | "code";
  textAlign?: "left" | "center" | "right";
  id?: string;
  opacity?: number;
}
```

## Example Code

```tsx
import { Text } from "@musecat/uikit";

export default function TextExample() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Text type="LargeTitle" weight={700} color="Base1">
        Page Title
      </Text>

      <Text type="Body" color="Base2">
        This is a standard body text that describes the contents of the page.
      </Text>

      <Text type="Caption1" color="Base3" textAlign="center">
        Footer description
      </Text>
    </div>
  );
}
```
