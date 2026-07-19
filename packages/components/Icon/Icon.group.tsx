import { Children } from "react";
import { Size, type UIKitSizeValue } from "../../frameworks/shared/sizing";
import View from "../../frameworks/View/View";
import Icon from "./Icon";
import type { IconGroupProps } from "./Icon.group.types";
import type { IconProps } from "./Icon.types";

const GROUP_PADDING = 2;
const ICON_PADDING = 6;

function getIconKey(icon: IconProps, index: number) {
  const title = typeof icon.title === "string" ? icon.title : undefined;

  return [
    title,
    icon.icon,
    icon.svg,
    icon.image,
    icon.width ?? 0,
    icon.height ?? 0,
    icon.color ?? "default",
    index,
  ].join("-");
}

function addSizeValues(a: UIKitSizeValue, b: UIKitSizeValue) {
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  }

  return `calc(${Size(a)} + ${Size(b)})`;
}

function resolveIcon(
  icon: IconProps,
  {
    single,
    groupPadding,
    iconBoxOptions,
    iconSize,
    iconWidth,
    iconHeight,
  }: {
    single: boolean;
    groupPadding: UIKitSizeValue;
    iconBoxOptions?: IconProps["boxOptions"];
    iconSize?: IconProps["size"];
    iconWidth?: IconProps["width"];
    iconHeight?: IconProps["height"];
  },
): IconProps {
  const boxed = icon.box ?? true;
  const resolvedPadding = boxed
    ? (icon.boxOptions?.padding ??
      iconBoxOptions?.padding ??
      (single ? addSizeValues(ICON_PADDING, groupPadding) : ICON_PADDING))
    : (icon.boxOptions?.padding ?? iconBoxOptions?.padding);

  return {
    box: true,
    border: icon.border,
    size: icon.size ?? iconSize,
    width: icon.width ?? iconWidth,
    height: icon.height ?? iconHeight,
    ...icon,
    boxOptions: {
      ...iconBoxOptions,
      ...icon.boxOptions,
      padding: resolvedPadding,
    },
  };
}

export default function IconGroup({
  className,
  style,
  children,
  icons,
  padding = GROUP_PADDING,
  iconBoxOptions,
  iconSize,
  iconWidth,
  iconHeight,
  background,
  border,
  radius,
}: IconGroupProps) {
  const iconItems = icons ? (Array.isArray(icons) ? icons : [icons]) : [];
  const itemCount = iconItems.length + Children.count(children);
  const single = itemCount === 1;

  return (
    <View
      alignItems="center"
      background={background ?? "Base1TP2"}
      radius={radius ?? "Circle"}
      border={border}
      className={className}
      style={{ backdropFilter: "blur(2px)", width: "max-content", ...style }}
      gap={2}
      padding={single ? 0 : padding}
    >
      {iconItems.map((icon, index) => (
        <Icon
          key={getIconKey(icon, index)}
          {...resolveIcon(icon, {
            single,
            groupPadding: padding,
            iconBoxOptions,
            iconSize,
            iconWidth,
            iconHeight,
          })}
        />
      ))}
      {children}
    </View>
  );
}
