# CodeBox

**Source:** [`packages/Components/CodeBox`](../../../packages/Components/CodeBox)

## Purpose

A component that displays code snippets with language syntax highlighting and includes a built-in code copy feature.

## Usage Logic

- Uses `PrismJS` to parse and highlight code. (HTML is injected internally.)
- Automatically places the language name at the top and a copy button (`CodeBox.copy` module) according to the supported language.
- Supports theme and layout (Radius, Border, etc.).

## Type Signatures

```typescript
interface CodeBoxProps extends ThemeSystemProps, RadiusProps, BorderProps {
  code: string;
  language?: string;
}
```

## Example Code

```tsx
import { CodeBox } from "@musecat/uikit";

export default function Example() {
  const sampleCode = `const hello = 'world';\nconsole.log(hello);`;
  return <CodeBox code={sampleCode} language="typescript" radius="Regular" />;
}
```
