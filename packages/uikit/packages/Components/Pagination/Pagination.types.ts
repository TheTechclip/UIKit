import type {
  BorderProps,
  ThemeSystemProps,
} from "../../Frameworks/Theme/Theme.types";

export interface PaginationProps extends ThemeSystemProps, BorderProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  page: number;
  total: number;
  onChange?: (page: number) => void;
  disabled?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  navigationLabel?: string;
  getPageLabel?: (page: number, isCurrent: boolean) => string;
}
