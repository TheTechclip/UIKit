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

import type { LabelSharedProps } from "@/packages/Components/Label/Label.types";

export interface SelectProps<Multiple extends boolean = false>
  extends LabelSharedProps {
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
