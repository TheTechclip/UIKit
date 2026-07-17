"use client";

import { useEffect, useRef, useState } from "react";
import styles from "@/packages/Components/Radio/Radio.module.scss";
import type { RadioProps } from "@/packages/Components/Radio/Radio.types";
import Text from "@/packages/Components/Text/Text";
import { Size } from "@/packages/Frameworks/_shared/sizing";
import View from "@/packages/Frameworks/View/View";

export default function Radio({
  title,
  titleType,
  titleSpaceBetween,
  reversed,
  readOnly,
  border,
  themePreset,
  background,
  color,
  themeInteractive,
  selected,
  radius,
  size,
  ...props
}: RadioProps) {
  const isControlled = props.checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(
    Boolean(props.defaultChecked),
  );
  const isChecked = isControlled ? Boolean(props.checked) : internalChecked;
  const isInteractive = themeInteractive ?? (!readOnly && !props.disabled);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isControlled) return;
    setInternalChecked(Boolean(props.checked));
  }, [isControlled, props.checked]);

  useEffect(() => {
    const radioGroup = props.name
      ? document.querySelectorAll(`input[type="radio"][name="${props.name}"]`)
      : null;
    if (!radioGroup) return;

    const handleChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target !== inputRef.current && target.checked) {
        setInternalChecked(target.value === props.value);
      }
    };

    radioGroup.forEach((radio) => {
      radio.addEventListener("change", handleChange);
    });

    return () => {
      radioGroup.forEach((radio) => {
        radio.removeEventListener("change", handleChange);
      });
    };
  }, [props.name, props.value]);

  return (
    <label
      className={styles.RadioWrapper}
      title={title}
      style={{
        gap: size ? `calc(${Size(size)} / 3)` : ".8rem",
        justifyContent: titleSpaceBetween ? "space-between" : undefined,
        width: titleSpaceBetween ? "100%" : undefined,
      }}
    >
      <input
        ref={inputRef}
        type="radio"
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
        border={border}
        themePreset={
          themePreset ?? (isChecked ? "ReversedUISecondary" : "UIPrimary")
        }
        background={background}
        color={color}
        themeInteractive={isInteractive}
        selected={selected}
        radius={radius ?? "Circle"}
        width={size ?? 24}
        height={size ?? 24}
        data-disabled={props.disabled ? "true" : undefined}
        data-readonly={readOnly ? "true" : undefined}
        style={{
          position: "relative",
          order: reversed ? 1 : undefined,
        }}
      >
        <View
          themePreset="UIPrimary"
          opacity={isChecked ? 1 : 0}
          radius={radius ?? "Circle"}
          width={typeof size === "number" ? size * 0.33 : ".8rem"}
          height={typeof size === "number" ? size * 0.33 : ".8rem"}
        />
      </View>
      {title && <Text type={titleType ?? "Subheadline"}>{title}</Text>}
    </label>
  );
}
