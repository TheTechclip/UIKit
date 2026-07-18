import clsx from "clsx";
import Pressable from "../../Frameworks/Pressable/Pressable";
import Icon from "../Icon/Icon";
import Text from "../Text/Text";
import type { PillProps } from "./Pill.types";

export function Pill({
  themePreset,
  background,
  color,
  themeInteractive,
  selected,
  border,
  radius,
  shadow,
  renderKey,
  icon,
  pressable,
  disabled,
  text,
  iconSize,
  padding,
  paddingHorizontal,
  paddingVertical,
  checkedThemePreset,
  gap,
  textType,
  textSize,
  textWeight,
  ellipsis,
  rightIcon,
  loading,
  className,
  style,
  shouldWrapText = true,
  "data-color-mode": dataColorMode,
}: PillProps) {
  const isChecked = Boolean(selected || pressable?.checked);
  const resolvedPreset =
    themePreset ??
    (isChecked ? (checkedThemePreset ?? "BaseFull") : "UIPrimary");
  const resolvedSelected = selected ?? isChecked;

  const {
    className: pressableClassName,
    style: pressableStyle,
    title: pressableTitle,
    disabled: pressableDisabled,
    ...restPressable
  } = pressable ?? {};

  return (
    <Pressable
      data-render-key={renderKey}
      data-color-mode={dataColorMode}
      {...restPressable}
      themePreset={resolvedPreset}
      background={background}
      color={color}
      themeInteractive={themeInteractive}
      selected={resolvedSelected}
      border={border ?? "Base3TP1"}
      radius={radius ?? "Regular"}
      shadow={shadow}
      disabled={disabled || loading || pressableDisabled}
      className={clsx(className, pressableClassName)}
      alignItems="center"
      justifyContent="center"
      height="max-content"
      gap={gap ?? 4}
      padding={padding ?? ".8rem 1rem"}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      style={{
        width: "max-content",
        minWidth: "max-content",
        textAlign: "center",
        overflow: "hidden",
        userSelect: "none",
        WebkitUserSelect: "none",
        ...style,
        ...pressableStyle,
      }}
      title={pressableTitle}
    >
      {}
      {icon && <Icon size={iconSize || 13} {...icon} />}

      {}
      {text && shouldWrapText ? (
        <Text
          type={textType || "Footnote"}
          size={textSize}
          weight={textWeight}
          verticalTrim
          style={
            ellipsis
              ? {
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  minWidth: 0,
                }
              : undefined
          }
        >
          {text}
        </Text>
      ) : text ? (
        text
      ) : null}

      {}
      {loading || rightIcon ? (
        <Icon
          size={iconSize || 12}
          box
          boxOptions={{ padding: ".2rem", margin: "-.2rem" }}
          spinner={loading}
          {...rightIcon}
        />
      ) : null}
    </Pressable>
  );
}

export default Pill;
