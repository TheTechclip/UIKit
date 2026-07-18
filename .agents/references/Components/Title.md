# Title

**Source:** [`packages/Components/Title`](../../../packages/Components/Title)

## 1. Purpose

A component for composing a UI title and related information (metadata, caption, action buttons, etc.). Used to render a header role or a section's main heading, and provides a `Title.ContextBar` sub-component that displays auxiliary actions and information to manage them integrally.

## 2. Usage Logic

- The `title` prop receives a single or multiple texts and elements.
- Text-related styling options such as `titleType`, `fontType` can manipulate the title's appearance.
- The `meta`, `caption`, `actions` props can arrange subtitles, additional info, and action buttons (icon groups).
- `Title.ContextBar` (assign a `ContextBar` object) can place left/right-aligned context buttons and icons inside the title component or independently.

## 3. Type Signatures

```tsx
export interface TitleProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  title?: TitleItemProps[] | TitleItemProps;
  titleType?: TextProps["type"];
  titleClassName?: TextProps["className"];
  titleGap?: ViewProps["gap"];
  leftGap?: ViewProps["gap"];
  rightGap?: ViewProps["gap"];
  fontType?: TextProps["fontType"];
  titleLineHeight?: number;
  titleVerticalTrim?: boolean;
  suffix?: PillProps;
  meta?: React.ReactNode;
  actions?: IconGroupProps["icons"];
  caption?: React.ReactNode;
  captionOpacity?: TextProps["opacity"];
  context?: React.ReactNode;
}

interface TitleItemProps {
  "data-color-mode"?: string;
  text?: React.ReactNode;
  active?: boolean;
  pressable?: PressableProps;
}

export interface TitleContextProps {
  className?: string;
  style?: React.CSSProperties;
  start?: TitleContextItem | TitleContextItem[];
  end?: TitleContextItem | TitleContextItem[];
  startGap?: ViewProps["gap"];
  endGap?: ViewProps["gap"];
}

export type TitleContextItem = Pick<
  PressableProps,
  | "className"
  | "style"
  | "themePreset"
  | "background"
  | "color"
  | "themeInteractive"
  | "selected"
  | "border"
  | "data-color-mode"
> & {
  key?: React.Key;
  content: React.ReactNode;
  leadingIcon?: IconProps["icon"];
  trailingIcon?: IconProps["icon"];
  leadingIconProps?: Omit<IconProps, "icon" | "pressable">;
  trailingIconProps?: Omit<IconProps, "icon" | "pressable">;
  pressable?: PressableProps;
};
```

## 4. Example Code

```tsx
import Title from "./Title";
import { IconBell, IconArrowLeft } from "lucide-react";

function Example() {
  return (
    <Title
      title={{ text: "Settings" }}
      titleType="Title2"
      caption="Manage your account settings"
      meta="User Profile"
      actions={[
        {
          icon: <IconBell />,
          pressable: { onPress: () => alert("Notifications") },
        },
      ]}
      context={
        <Title.ContextBar
          start={{
            content: "Back",
            leadingIcon: <IconArrowLeft />,
            pressable: {},
          }}
          end={{ content: "Save", pressable: {} }}
        />
      }
    />
  );
}
```
