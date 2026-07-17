import type { RadiusProps } from "../../Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../Frameworks/Theme/Theme.types";

export interface ContributionActivity {
  date: string | Date;
  level: 0 | 1 | 2 | 3 | 4;
  total_count?: number;
  changelog_count?: number;
  flag_count?: number;
  legacy_ticket_count?: number;
}

export interface ContributionGraphProps
  extends ThemeSystemProps,
    RadiusProps,
    BorderProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  data?: ContributionActivity[];
  endDate?: string | Date;
  visibleDays?: number;
  locale?: string;
}
