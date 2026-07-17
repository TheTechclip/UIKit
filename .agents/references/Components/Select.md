# Select

## Purpose

The `Select` component provides a dropdown menu for receiving single or multiple item selection from the user. It natively supports accessibility and keyboard navigation, and is provided as a custom UI wrapping the native `<select>` element.

## Usage Logic

- **Single/Multiple Selection**: The type signature and return value differ based on the `multiple` prop value (`string` or `string[]`). Generics are used so the value type received in `onChange` is automatically inferred.
- **Option structure**: Uses `Option` (value, label, description, icon) objects or `OptGroup` object arrays rather than a simple string array. Internally composed of `Select.trigger.tsx` (control Pressable), `select.control.tsx` (control + combobox orchestration), and `select.inner.tsx` (ContextMenu integration).
- **Combobox/Search**: The `combobox` prop allows composing a searchable select box.

## Type Signatures

```typescript
export interface Option {
  value: string | number;
  label: string;
  description?: string;
  icon?: string;
  disabled?: boolean;
}

export interface OptGroup {
  label: string;
  options: Option[];
}

export type SelectValue<Multiple extends boolean = false> =
  Multiple extends true ? string[] : string;

export type SelectChangeEvent<Multiple extends boolean = false> =
  | React.ChangeEvent<HTMLSelectElement>
  | { target: { value: SelectValue<Multiple> } };

export interface SelectProps<
  Multiple extends boolean = false,
> extends LabelSharedProps {
  id?: string;
  value?: SelectValue<Multiple>;
  defaultValue?: SelectValue<Multiple>;
  onChange?: (e: SelectChangeEvent<Multiple>) => void;
  onInputChange?: (value: string) => void;
  options?: (Option | OptGroup)[];
  required?: boolean;
  placeholder?: string;
  lockAncestorScrollOnOpen?: boolean;
  multiple?: Multiple;
  combobox?: boolean | "inline" | "search";
  disabled?: boolean;
  readOnly?: boolean;
}
```

## Example Code

```tsx
import { Select } from "@musecat/uikit";
import { useState } from "react";

export default function SelectExample() {
  const [value, setValue] = useState<string>("");

  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry", disabled: true },
  ];

  return (
    <Select
      title="Select Fruit"
      placeholder="Please select a fruit"
      value={value}
      onChange={(e) => setValue(e.target.value as string)}
      options={options}
    />
  );
}
```
