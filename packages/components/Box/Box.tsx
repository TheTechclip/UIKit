import clsx from "clsx";
import Pressable from "../../frameworks/Pressable/Pressable";
import View from "../../frameworks/View/View";
import Divider from "../Divider/Divider";
import Icon from "../Icon/Icon";
import Spinner from "../Spinner/Spinner";
import Text from "../Text/Text";
import styles from "./Box.module.scss";
import type { BoxContentProps, BoxFooterProps, BoxProps } from "./Box.types";

export default function Box({
  themePreset,
  background,
  color,
  themeInteractive,
  selected,
  border,
  children,
  radius,
  shadow,
  style,
  className,
  "data-color-mode": dataTheme,
}: BoxProps) {
  return (
    <View
      column
      gap={0}
      className={clsx(styles.Box, className)}
      height="min-content"
      data-color-mode={dataTheme}
      border={border}
      radius={radius ?? "Regular"}
      shadow={shadow}
      themePreset={themePreset ?? "UIPrimary"}
      background={background}
      color={color}
      themeInteractive={themeInteractive}
      selected={selected}
      style={{ overflow: "hidden", ...style }}
    >
      {children}
    </View>
  );
}

export function BoxContent({
  title,
  titleSize,
  children,
  contentClassName,
  contentStyle,
  "data-color-mode": dataTheme,
  icon,
  loading,
  card,
  padding,
  paddingHorizontal,
  paddingVertical,
}: BoxContentProps) {
  return (
    <>
      {(title || icon || loading) && (
        <View
          alignItems="center"
          data-color-mode={dataTheme}
          gap={6}
          className={styles.BoxHeader}
          justifyContent="space-between"
          fullWidth
        >
          <View alignItems="center" gap={6} data-color-mode={dataTheme}>
            {icon && <Icon size={12} {...icon} />}
            {title && <Text type={titleSize || "Footnote"}>{title}</Text>}
          </View>
          {loading && <Spinner size={12} opacity={0.6} />}
        </View>
      )}
      {children && (
        <View
          column
          gap={card ? 2 : undefined}
          className={clsx(
            styles.BoxContent,
            card && styles.CardMode,
            contentClassName,
          )}
          data-color-mode={dataTheme}
          padding={padding}
          paddingHorizontal={paddingHorizontal}
          paddingVertical={paddingVertical}
          style={contentStyle}
        >
          {children}
        </View>
      )}
    </>
  );
}

export function BoxFooter({
  title,
  titleSize,
  children,
  className,
  style,
  "data-color-mode": dataTheme,
  icon,
  pressable,
  divider,
  radius,
  themePreset,
  background,
  color,
  border,
  shadow,
  themeInteractive,
  selected,
  disabled,
  readOnly,
  backgroundBlur,
}: BoxFooterProps) {
  return (
    <View column gap={0}>
      <Divider gradient {...divider} marginVertical={2} />
      <Pressable
        data-color-mode={dataTheme}
        className={className}
        style={{ textAlign: "center", ...style }}
        alignItems="center"
        justifyContent="center"
        gap={6}
        padding={[10, 12]}
        fullWidth
        radius={radius ?? "Light"}
        {...pressable}
        themePreset={pressable?.themePreset ?? themePreset}
        background={pressable?.background ?? background}
        color={pressable?.color ?? color}
        border={pressable?.border ?? border}
        shadow={pressable?.shadow ?? shadow}
        themeInteractive={
          pressable?.themeInteractive ?? themeInteractive ?? true
        }
        selected={pressable?.selected ?? selected}
        disabled={pressable?.disabled ?? disabled}
        readOnly={pressable?.readOnly ?? readOnly}
        backgroundBlur={pressable?.backgroundBlur ?? backgroundBlur}
      >
        {title && (
          <Text type={titleSize || "Footnote"} opacity={0.6}>
            {title}
          </Text>
        )}
        {children}
        {icon && <Icon size={14} opacity={0.6} {...icon} />}
      </Pressable>
    </View>
  );
}

Box.Content = BoxContent;
Box.Footer = BoxFooter;
