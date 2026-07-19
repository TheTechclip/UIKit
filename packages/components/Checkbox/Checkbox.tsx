"use client";

import { useEffect, useState } from "react";
import { Size } from "../../frameworks/shared/sizing";
import View from "../../frameworks/View/View";
import Icon from "../Icon/Icon";
import Text from "../Text/Text";
import styles from "./Checkbox.module.scss";
import type { CheckboxProps } from "./Checkbox.types";

export default function Checkbox({
  title,
  titleType,
  titleSpaceBetween,
  reversed,
  readOnly,
  "data-color-mode": dataTheme,
  size,
  radius,
  border,
  themePreset,
  background,
  color,
  themeInteractive,
  selected,
  ...props
}: CheckboxProps) {
  const isControlled = props.checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(
    Boolean(props.defaultChecked),
  );
  const isChecked = isControlled ? Boolean(props.checked) : internalChecked;
  const isInteractive = themeInteractive ?? (!readOnly && !props.disabled);

  useEffect(() => {
    if (!isControlled) return;
    setInternalChecked(Boolean(props.checked));
  }, [isControlled, props.checked]);

  return (
    <label
      className={styles.CheckboxWrapper}
      data-color-mode={dataTheme}
      title=""
      style={{
        gap: size ? `calc(${Size(size)} / 3)` : ".8rem",
        justifyContent: titleSpaceBetween ? "space-between" : undefined,
        width: titleSpaceBetween ? "100%" : undefined,
      }}
    >
      <input
        type="checkbox"
        readOnly={readOnly}
        className={styles.Input}
        aria-checked={isChecked}
        {...props}
        checked={isControlled ? props.checked : undefined}
        defaultChecked={isControlled ? undefined : props.defaultChecked}
        onChange={(event) => {
          if (!isControlled) {
            setInternalChecked(event.currentTarget.checked);
          }
          props.onChange?.(event);
        }}
      />
      <View
        alignItems="center"
        justifyContent="center"
        width={size ?? 24}
        height={size ?? 24}
        border={border}
        radius={radius ?? "ExtraLight"}
        themePreset={
          themePreset ?? (isChecked ? "ReversedUISecondary" : "UIPrimary")
        }
        background={background}
        color={color}
        themeInteractive={isInteractive}
        selected={selected}
        data-disabled={props.disabled ? "true" : undefined}
        data-readonly={readOnly ? "true" : undefined}
        style={{
          position: "relative",
          order: reversed ? 1 : undefined,
        }}
      >
        <Icon
          icon="iCheck"
          weight={700}
          size={typeof size === "number" ? size * 0.75 : 20}
          opacity={isChecked ? 1 : 0}
        />
      </View>
      {title && (
        <Text
          style={{ minWidth: 0, flex: 1 }}
          type={titleType ?? "Subheadline"}
        >
          {title}
        </Text>
      )}
    </label>
  );
}
