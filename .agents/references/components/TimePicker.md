# TimePicker

**Source:** [`packages/components/TimePicker`](../../../packages/components/TimePicker)

## Purpose

The `TimePicker` component is an input field that lets users select a time by directly entering hours, minutes, (optionally seconds and AM/PM) or adjusting via arrow keys.

## Usage Logic

- **Interaction**: Supports precise keyboard navigation within the input field via number keys, arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`), tab key, etc.
- **Time Format**: `showSeconds` determines whether to display seconds, and `use12h` selects between 12-hour (AM/PM display) and 24-hour formats.
- **Component Architecture**: Composed of `TimePicker.core.tsx` (managing input and state) and `TimePicker.tsx` (handling layout/styling), abstracting complex focus-movement logic to improve usability. Covered in a single document integrated with the core logic.
- **Controlled/Uncontrolled**: State is controlled via `value` and `defaultValue`. Time is handled as a string in `HH:mm` or `HH:mm:ss` format.

## Type Signatures

```typescript
import type { LabelProps } from "../Label/Label.types";

export interface TimePickerProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  hint?: LabelProps["hint"];

  value?: string;
  defaultValue?: string;

  showSeconds?: boolean;
  use12h?: boolean;

  placeholder?: string;
  onChange?: (value: string) => void;
  onHourOverflow?: (params: { input: number; normalized: number }) => void;
}
```

## Example Code

```tsx
import { TimePicker } from "@musecat/uikit";
import { useState } from "react";

export default function TimePickerExample() {
  const [time, setTime] = useState("14:30");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "300px",
      }}
    >
      {/* Default 24-hour */}
      <TimePicker title="Meeting Time" value={time} onChange={setTime} />

      {/* 12-hour and with seconds */}
      <TimePicker
        title="Timer Setting"
        use12h
        showSeconds
        defaultValue="02:15:30"
      />
    </div>
  );
}
```
