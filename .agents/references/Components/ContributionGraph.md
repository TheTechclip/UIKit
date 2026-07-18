# ContributionGraph

**Source:** [`packages/Components/ContributionGraph`](../../../packages/Components/ContributionGraph)

## 1. Purpose

- A GitHub contribution-graph style visualization component.
- Role: Maps daily activity data into 0~4 levels and displays the activity pattern over a period such as a year as a grid.

## 2. Usage Logic

- Receives an array of per-date activity objects via the `data` property.
- Calculates the entire grid to display based on `endDate` and `visibleDays`; by default it shows the most recent 1 year (Rolling Year) from the end date.
- Supports month titles, weekday labels, and left-right drag scrolling (including pointer/mouse-based touch scrolling).
- Inherits `ThemeSystemProps` so design tokens like `themePreset`, `radius`, `border` can be injected externally.

## 3. Type Signatures

```typescript
export interface ContributionActivity {
  date: string | Date;
  level: 0 | 1 | 2 | 3 | 4;
  total_count?: number;
  changelog_count?: number;
  flag_count?: number;
  legacy_ticket_count?: number;
}

export interface ContributionGraphProps
  extends ThemeSystemProps, RadiusProps, BorderProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  data?: ContributionActivity[];
  endDate?: string | Date;
  visibleDays?: number;
  locale?: string;
}
```

## 4. Example Code

```tsx
import { ContributionGraph } from "@musecat/uikit";

export default function Example() {
  const data = [
    { date: "2024-01-01", level: 3, total_count: 5 },
    { date: "2024-01-02", level: 1, total_count: 1 },
  ];

  return (
    <ContributionGraph
      data={data}
      endDate={new Date()}
      visibleDays={365}
      locale="ko"
      themePreset="BaseFull"
      radius="Regular"
    />
  );
}
```
