import type { LabelProps } from "@/packages/Components/Label/Label.types";

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
