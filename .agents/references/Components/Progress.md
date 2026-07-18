# Progress

**Source:** [`packages/Components/Progress`](../../../packages/Components/Progress)

## Purpose

A linear progress bar component that visualizes task progress as a percentage. It can also render an indeterminate spinner-style infinite loading state for tasks with unknown duration.

## Usage Logic

- **Determinate state**: When `value`, `min`, `max` are passed, the progress rate (percentage) is calculated by the formula `(value - min) / (max - min) * 100`, adjusting the width of the inner indicator view (using the `--progress-percent` CSS variable).
- **Indeterminate state**: When `indeterminate={true}` is set, instead of a percentage-based progress bar, the inner `Spinner` component is rendered directly to indicate an infinite loading state.
- Value clamping: Even if the passed `value` is out of range, it is safely adjusted between `min` and `max` automatically.

## Type Signatures

```tsx
// Progress.types.ts
import { RadiusProps } from "@musecat/uikit";
import type {
  ThemeBackgroundPaint,
  ThemePaint,
} from "../../Frameworks/Theme/Theme.types";

export interface ProgressProps extends RadiusProps {
  value?: number; // current progress value (default: 0)
  min?: number; // minimum value (default: 0)
  max?: number; // maximum value (default: 100)
  indeterminate?: boolean; // whether in indeterminate (infinite loading) state

  background?: ThemeBackgroundPaint; // track (background) color theme
  color?: ThemePaint; // indicator (progress bar) color theme

  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
}
```

## Example Code

```tsx
import { Progress } from "@musecat/uikit";

export function FileUploadStatus({
  progressPercentage,
  isUploading,
  isPreparing,
}) {
  // Preparing, so total length unknown (indeterminate state)
  if (isPreparing) {
    return <Progress indeterminate={true} />;
  }

  // Uploading (determinate state)
  if (isUploading) {
    return (
      <div style={{ width: "300px" }}>
        <span>Uploading: {progressPercentage}%</span>
        <Progress
          value={progressPercentage}
          min={0}
          max={100}
          color="BlueSolid"
          background="Base6TP6"
          radius="Circle"
        />
      </div>
    );
  }

  return <span>Upload complete</span>;
}
```
