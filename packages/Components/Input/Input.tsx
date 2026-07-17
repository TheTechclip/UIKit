"use client";

import clsx from "clsx";
import { useId } from "react";
import styles from "./Input.module.scss";
import type { InputProps } from "./Input.types";
import Label from "../Label/Label";
import Text from "../Text/Text";
import View from "../../Frameworks/View/View";

export default function Input({
  type,
  title,
  required,
  value,
  hint,
  readOnly,
  disabled,
  placeholder,
  prefix,
  themePreset,
  background,
  color,
  themeInteractive,
  selected,
  border,
  "data-color-mode": dataTheme,
  style,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = props.id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const describedBy = [props["aria-describedby"], hintId]
    .filter(Boolean)
    .join(" ");
  const hasError = hint?.type === "error";

  return (
    <Label
      data-color-mode={dataTheme}
      htmlFor={inputId}
      hintId={hintId}
      title={title}
      required={required}
      readOnly={readOnly}
      disabled={disabled}
      hint={hint}
      themePreset={themePreset}
      background={background}
      color={color}
      themeInteractive={themeInteractive}
      selected={selected}
      border={border}
      style={style}
      className={className}
    >
      <View alignItems="center" gap={4}>
        {prefix ? (
          <Text
            type="Subheadline"
            style={{ userSelect: "none" }}
            opacity={0.4}
            aria-hidden
          >
            {prefix}
          </Text>
        ) : null}
        <input
          id={inputId}
          type={type}
          readOnly={readOnly}
          className={clsx(styles.Input, "Subheadline")}
          required={required}
          disabled={disabled}
          value={value}
          style={undefined}
          placeholder={placeholder}
          {...props}
          aria-describedby={describedBy || undefined}
          aria-invalid={hasError || undefined}
        />
      </View>
    </Label>
  );
}
