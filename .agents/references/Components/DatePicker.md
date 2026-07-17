# DatePicker

## 1. Purpose

- A date and time selection component.
- Role: Provides a single date (`single`) or range (`range`) selection interface, with integrated time selection option (`showTime`). Supports both calendar selection via popover and direct editing of the input field.

## 2. Usage Logic

- **Component Separation**:
  - `DatePicker.tsx`: Externally exposed wrapper. Combines the field (core) and popover calendar.
  - `DatePicker.core.tsx`: Actual input field UI and keyboard manipulation (arrows, number input) logic.
  - `DatePicker.calendar.tsx`: Grid-based calendar interface rendered inside the popover.
  - `hooks/useCalendar.ts`: Calendar paging (prev/next month, year navigation).
  - `hooks/useSelection.ts`: Single/range date selection state management.
  - `DatePicker.utils.ts`: Date calculation and string parsing utilities.
- **Mode Branching**: `mode="single"` (single date) or `mode="range"` (start-end range).
- **Time Combination**: When `showTime=true`, a `TimePickerCore` is embedded as an independent input field separate from the calendar. The `use12h` option switches between 12/24-hour formats.
- **Built-in Label**: Receives `LabelProps` such as `title`, `required`, `hint` to render a complete form element structure.

## 3. Type Signatures

```typescript
export type DatePickerMode = "single" | "range";

export interface DatePickerProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  hint?: {
    type: "info" | "error" | "warning" | "success";
    text: React.ReactNode;
  };

  mode?: DatePickerMode;

  // Single mode props
  value?: string;
  defaultValue?: string;
  onChange?: (value: string | null) => void;

  // Range mode props
  startDate?: string;
  endDate?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;
  onRangeChange?: (start: string | null, end: string | null) => void;

  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  disabledDaysOfWeek?: number[];

  showTime?: boolean;
  use12h?: boolean;
}
```

## 4. Example Code

```tsx
import DatePicker from "@/packages/Components/DatePicker/DatePicker";

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Single date selection */}
      <DatePicker
        mode="single"
        title="Date of Birth"
        defaultValue="1990-01-01"
        onChange={(val) => console.log(val)}
      />

      {/* Range and time selection */}
      <DatePicker
        mode="range"
        title="Event Period"
        showTime
        use12h
        defaultStartDate="2024-05-01 10:00"
        defaultEndDate="2024-05-07 18:00"
        onRangeChange={(start, end) => console.log("Range:", start, end)}
      />
    </div>
  );
}
```
