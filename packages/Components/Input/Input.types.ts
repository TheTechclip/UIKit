import type { ReactNode } from "react";
import type { LabelSharedProps } from "@/packages/Components/Label/Label.types";

export interface InputProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "prefix" | keyof LabelSharedProps
    >,
    LabelSharedProps {
  value?: string | number;
  type?: string;
  placeholder?: string;
  prefix?: ReactNode;
}
