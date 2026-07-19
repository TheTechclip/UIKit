"use client";
import type { ReactElement } from "react";
import SelectInner from "./Select.inner";
import type { SelectProps } from "./Select.types";

export default function Select(props: SelectProps<false>): ReactElement;
export default function Select(props: SelectProps<true>): ReactElement;
export default function Select(props: SelectProps<boolean>): ReactElement;
export default function Select(props: SelectProps<boolean>): ReactElement {
  return <SelectInner {...props} />;
}
