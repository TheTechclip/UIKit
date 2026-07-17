# Header

## 1. Purpose

- A global or screen-level top navigation header component.
- Role: Provides a `position: fixed` layout at the top and includes a background blur transition (`EdgeEffect`) by default.

## 2. Usage Logic

- Rendered fixed at the very top of the viewport (`top: 0`), applying a smooth overlay/blur fade effect on content scroll via the top EdgeEffect.
- Inject ReactNodes into `left`, `center`, `right` props respectively to arrange items flexibly.
- Controllable via separation of the inner content wrapper (`wrapperClassName`) and the top-level `<header>` (`className`).

## 3. Type Signatures

```typescript
export interface HeaderProps {
  "data-color-mode"?: string;
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  wrapperClassName?: string;
}
```

## 4. Example Code

```tsx
import { Header } from "@musecat/uikit";
import { Icon } from "@musecat/uikit";
import { Text } from "@musecat/uikit";

export default function Example() {
  return (
    <Header
      left={
        <Icon
          icon="iArrowKeyLeft"
          pressable={{ onClick: () => history.back() }}
        />
      }
      center={
        <Text type="Title3" weight={600}>
          Screen Title
        </Text>
      }
      right={<Icon icon="iSearch" />}
    />
  );
}
```
