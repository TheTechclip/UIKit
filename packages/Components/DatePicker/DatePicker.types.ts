import type { LabelProps } from "@/packages/Components/Label/Label.types";

export type DatePickerMode = "single" | "range";

export interface DatePickerProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  hint?: LabelProps["hint"];

  mode?: DatePickerMode;

  value?: string;
  defaultValue?: string;

  startDate?: string;
  endDate?: string;
  defaultStartDate?: string;
  defaultEndDate?: string;

  placeholder?: string;

  minDate?: string;
  maxDate?: string;
  disabledDaysOfWeek?: number[];

  showTime?: boolean;
  use12h?: boolean;

  onRangeChange?: (start: string | null, end: string | null) => void;
  onChange?: (value: string | null) => void;
}
