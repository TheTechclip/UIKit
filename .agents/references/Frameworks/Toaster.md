# Toaster

**Source:** [`packages/Frameworks/Toaster/Toaster.boot.tsx`](../../../packages/Frameworks/Toaster/Toaster.boot.tsx) and [`Toaster.types.ts`](../../../packages/Frameworks/Toaster/Toaster.types.ts)

## Purpose

The `Toaster` framework is a wrapper component for displaying toast messages (notifications) used throughout the application. It internally uses the `sonner` library and provides custom styles and default icon settings tailored to UIKit's design system (icons, color mode, etc.).

## Usage Logic

- Render `ToasterBootstrap` (default export) at the top level (Root Layout, etc.).
- Where you need to show a toast message, use the `toast` object re-exported from the `sonner` package to trigger messages.
- Automatically injects UIKit's color mode and custom icons (`Icon` component) to maintain application consistency.
- Mount exactly one bootstrap near the application root. `toast` is the Sonner API re-export; its notification calls can be made from client-side event handlers after bootstrap exists.

## Type Signatures

```typescript
import type { IconProps } from "../../Components/Icon/Icon.types";
import type { ToasterProps } from "sonner";

export interface ToasterBootstrapProps extends ToasterProps {
  "data-color-mode"?: string;
  theme?: ToasterProps["theme"];
  icon?: IconProps;
  title?: React.ReactNode;
  storage?: {
    key?: string;
    value?: string;
  }[];
}


```

## Example Code

```tsx
// 1. Render at the top level (App component, etc.)
import { ToasterBootstrap } from "@musecat/uikit";

export default function App() {
  return (
    <>
      <ToasterBootstrap data-color-mode="dark" />
      <MyComponents />
    </>
  );
}

// 2. Show toast
import { toast } from "@musecat/uikit";

function MyComponents() {
  const handleSuccess = () => {
    toast.success("Saved successfully.");
  };

  const handleError = () => {
    toast.error("An error occurred.");
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Fail</button>
    </div>
  );
}
```
