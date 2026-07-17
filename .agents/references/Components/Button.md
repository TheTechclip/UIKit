# Button

## Purpose

A versatile button component supporting various styles, icon placement, and asynchronous states (Promise).

## Usage Logic

- `Button` is built on Pressable and can express text, icons, and asynchronous results (loading/success/error) together.
- The `iconEnd` prop or props like `modal`, `column` support various layouts (vertical arrangement, full-width modal button, etc.).
- When a `promise` prop is given, it automatically renders loading and completion state icons and disables click events.

## Type Signatures

```typescript
interface ButtonProps extends ThemeSystemProps, RadiusProps, BorderProps {
  icon?: IconProps;
  pressable?: PressableProps;
  textType?: TextProps["type"];
  sizeFull?: boolean;
  promise?: {
    type: "loading" | "success" | "error";
    text?: React.ReactNode;
  };
  text?: React.ReactNode;
  column?: boolean;
  modal?: boolean;
  iconEnd?: ButtonIconEndProps;
  reversed?: boolean;
}
```

## Example Code

```tsx
import Button from "@/packages/Components/Button/Button";

export default function Example() {
  return (
    <Button
      text="Submit"
      themePreset="UIPrimary"
      promise={{ type: "loading", text: "Loading..." }}
      pressable={{ onClick: () => console.log("Submit") }}
      icon={{ icon: "iCheck" }}
    />
  );
}
```
