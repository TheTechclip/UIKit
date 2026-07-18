# Pagination

**Source:** [`packages/Components/Pagination`](../../../packages/Components/Pagination)

## Purpose

A pagination controller that helps navigate data or lists split across multiple pages. Along with previous/next and first/last navigation buttons, it provides an `input` area where users can directly enter a desired page number to jump quickly.

## Usage Logic

- **`Pagination`**: Receives `page` (current page) and `total` (total page count) props to compose the navigation bar.
- Internally manages an `input` field for numeric entry, applying a debounce timer (350ms) so it does not jump immediately while the user is typing, but waits for input completion (or Enter key) before firing the `onChange` event.
- Invalid page input is automatically clamped to the minimum (1) or maximum (`total`) value.
- For i18n, internally uses the `Word()` hook to provide default labels ("Previous", "Next", etc.), and custom labels can also be injected directly.

## Type Signatures

```tsx
// Pagination.types.ts
import type {
  BorderProps,
  ThemeSystemProps,
} from "../../Frameworks/Theme/Theme.types";

export interface PaginationProps extends ThemeSystemProps, BorderProps {
  page: number; // currently selected page number
  total: number; // total page count (last page number)
  onChange?: (page: number) => void; // page move event callback
  disabled?: boolean; // disable the entire component

  // Label customization (optional)
  previousLabel?: string;
  nextLabel?: string;
  navigationLabel?: string;
  getPageLabel?: (page: number, isCurrent: boolean) => string;

  className?: string;
  style?: React.CSSProperties;
}
```

## Example Code

```tsx
import { Pagination } from "@musecat/uikit";
import { useState } from "react";

export function DataList() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 25;

  return (
    <div style={{ padding: "20px" }}>
      <ul>
        {/* Render data list logic matching the current page */}
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>

      <Pagination
        page={currentPage}
        total={totalPages}
        onChange={(newPage) => setCurrentPage(newPage)}
        themePreset="UIPrimary"
      />
    </div>
  );
}
```
