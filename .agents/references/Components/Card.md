# Card

## Purpose

A card component supporting basic information grouping and accordion (foldable) expansion.

## Usage Logic

- `Card`: Automatically branches to render `Card.default` or `Card.foldable` depending on the presence of the `accordion` prop.
- `Card.default`: Can arrange title, caption, icon, a custom right-side component (`customRight`), and Pill tags horizontally or vertically.
- `Card.foldable`: Includes an expand/collapse animation on click (using `motion/react`), and the open state can be controlled and synchronized via the `accordion` object. Also supports radius change animation.

## Type Signatures

```typescript
interface CardBaseProps extends BorderProps, RadiusProps {
  vertical?: boolean;
  contained?: boolean;
  pressable?: PressableProps;
  title?: React.ReactNode;
  caption?: React.ReactNode;
  icon?: IconProps;
  arrow?: IconProps | boolean;
  pill?: PillProps[] | PillProps;
  customRight?: React.ReactNode;
}

interface CardDefaultProps extends CardBaseProps, ThemeSystemProps {
  accordion?: never;
}

interface CardFoldableProps extends Omit<
  CardBaseProps,
  "title" | "caption" | "vertical"
> {
  accordion: CardAccordionProps;
  themePreset?: Stateful<ThemePreset>;
  title?: Stateful<React.ReactNode>;
  caption?: Stateful<React.ReactNode>;
}

type CardProps = CardDefaultProps | CardFoldableProps;
```

## Example Code

```tsx
import Card from "@/packages/Components/Card/Card";

export default function Example() {
  return (
    <>
      <Card
        title="Static Card"
        caption="Sub description"
        icon={{ icon: "iInfo" }}
      />
      <Card
        title={{ normal: "Expandable", activated: "Expanded!" }}
        accordion={{ name: "group1", value: "item1" }}
      >
        <p>Hidden content revealed on click.</p>
      </Card>
    </>
  );
}
```
