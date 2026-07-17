"use client";
import type { ReactElement } from "react";
import type { SelectProps } from "@/packages/Components/Select/Select.types";
import SelectInner from "@/packages/Components/Select/select.inner";

export default function Select(props: SelectProps<false>): ReactElement;
export default function Select(props: SelectProps<true>): ReactElement;
export default function Select(props: SelectProps<boolean>): ReactElement;
export default function Select(props: SelectProps<boolean>): ReactElement {
  return <SelectInner {...props} />;
}
