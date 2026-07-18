import type { IconProps } from "../Icon/Icon.types";
import type { PillProps } from "../Pill/Pill.types";
import type { PressableProps } from "../../Frameworks/Pressable/Pressable.types";
import type { RadiusProps } from "../../Frameworks/Theme/Radius.types";
import type {
  BorderProps,
  ThemeBackgroundPaint,
  ThemePaint,
  ThemePreset,
  ThemeSystemProps,
} from "../../Frameworks/Theme/Theme.types";

export type Stateful<T> = T | { normal?: T; activated?: T };

export function resolveState<T>(
  value: Stateful<T> | undefined,
  activated: boolean,
): T | undefined {
  if (value === undefined) return undefined;
  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    ("normal" in value || "activated" in value)
  ) {
    return activated ? value.activated : value.normal;
  }
  return value as T;
}

export interface CardBaseProps extends BorderProps, RadiusProps {
  "data-color-mode"?: string;
  className?: string;
  style?: React.CSSProperties;
  vertical?: boolean;
  contained?: boolean;

  pressable?: PressableProps;

  title?: React.ReactNode;
  caption?: React.ReactNode;
  titleReversed?: boolean;

  icon?: IconProps;

  arrow?:
    | (IconProps & {
        filled?: boolean;
        degree?: 0 | 90 | 180 | 270;
      })
    | boolean;

  pill?: PillProps[] | PillProps;

  customRight?: React.ReactNode;
  customRightAllowDefault?: boolean;
}

export interface CardDefaultProps extends CardBaseProps, ThemeSystemProps {
  title?: React.ReactNode;
  caption?: React.ReactNode;
  accordion?: never;
}

export interface CardAccordionProps {
  name?: string;
  value?: string;
  activated?: boolean;
  defaultActivated?: boolean;
  onActivatedChange?: (activated: boolean) => void;
  innerClassName?: string;
  innerStyle?: React.CSSProperties;
  animateRadius?: boolean;
}

export interface CardFoldableProps
  extends Omit<
      CardBaseProps,
      "title" | "caption" | "titleReversed" | "vertical"
    >,
    Omit<ThemeSystemProps, "themePreset" | "color" | "background"> {
  children?: React.ReactNode;
  accordion: CardAccordionProps;
  themePreset?: Stateful<ThemePreset>;
  color?: Stateful<ThemePaint>;
  background?: Stateful<ThemeBackgroundPaint>;
  title?: Stateful<React.ReactNode>;
  caption?: Stateful<React.ReactNode>;
}

export type CardProps = CardDefaultProps | CardFoldableProps;
