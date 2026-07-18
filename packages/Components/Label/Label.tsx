import clsx from "clsx";
import { Word } from "../../../i18n/shared";
import Pressable from "../../Frameworks/Pressable/Pressable";
import View from "../../Frameworks/View/View";
import Icon from "../Icon/Icon";
import Text from "../Text/Text";
import styles from "./Label.module.scss";
import type { LabelProps } from "./Label.types";

export default function Label({
  children,
  className,
  themePreset,
  background,
  color,
  themeInteractive,
  selected,
  border,
  radius,
  style,
  cursor,
  htmlFor,
  hintId,
  title,
  required,
  hint,
  readOnly,
  disabled,
  shadow,
  "data-color-mode": dataTheme,
}: LabelProps) {
  const t = Word();
  const isInteractive = themeInteractive ?? (!readOnly && !disabled);

  return (
    <View column gap={6}>
      <label htmlFor={htmlFor}>
        <Pressable
          background={background}
          color={color}
          border={border}
          radius={radius ?? "Regular"}
          themePreset={themePreset ?? "UIPrimary"}
          themeInteractive={isInteractive}
          selected={selected}
          shadow={shadow}
          readOnly={readOnly}
          disabled={disabled}
          data-color-mode={dataTheme}
          className={clsx(styles.Label, className)}
          column
          gap={4}
          padding={[12, 16]}
          height="max-content"
          style={{ overflow: "hidden", cursor, ...style }}
        >
          {(title || required) && (
            <View alignItems="center" gap={2}>
              {title && (
                <Text type="Footnote" opacity={0.6}>
                  {title}
                </Text>
              )}
              {required && (
                <Text type="Caption2" color="Red4">
                  *{t.UIKit.actions.required}
                </Text>
              )}
            </View>
          )}
          {children}
        </Pressable>
      </label>
      {hint && (
        <View id={hintId} gap={4} padding="0 0 0 1.2rem" opacity={0.6}>
          <Icon
            icon={
              hint.type === "error"
                ? "iCloseCircle"
                : hint.type === "warning"
                  ? "iWarningCircle"
                  : hint.type === "info"
                    ? "iInfoCircle"
                    : hint.type === "success"
                      ? "iCheckCircle"
                      : undefined
            }
            color={
              hint.type === "error"
                ? "Red3"
                : hint.type === "success"
                  ? "Green3"
                  : undefined
            }
            iconFill
            size={16}
          />
          <Text
            type="Caption1"
            weight={400}
            color={
              hint.type === "error"
                ? "Red3"
                : hint.type === "success"
                  ? "Green3"
                  : undefined
            }
          >
            {hint.text}
          </Text>
        </View>
      )}
    </View>
  );
}
