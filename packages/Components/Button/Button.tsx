"use client";

import clsx from "clsx";
import type { ButtonProps } from "@/packages/Components/Button/Button.types";
import Divider from "@/packages/Components/Divider/Divider";
import Icon from "@/packages/Components/Icon/Icon";
import Text from "@/packages/Components/Text/Text";
import Pressable from "@/packages/Frameworks/Pressable/Pressable";
import View from "@/packages/Frameworks/View/View";

function resolveButtonEndIcon(iconEnd: ButtonProps["iconEnd"]) {
  if (!iconEnd?.pressable?.popover) {
    return iconEnd;
  }
  return {
    ...iconEnd,
    pressable: {
      ...iconEnd.pressable,
      popover: {
        ...iconEnd.pressable.popover,
        placement: iconEnd.pressable.popover.placement ?? "bottom",
      },
    },
  };
}

function ButtonContent({
  icon,
  text,
  textType,
  column,
  reversed,
  promise,
}: Pick<
  ButtonProps,
  "icon" | "text" | "textType" | "column" | "reversed" | "promise"
>) {
  if (promise?.type) {
    const isError = promise.type === "error";
    const isSuccess = promise.type === "success";
    const isLoading = promise.type === "loading";

    return (
      <View alignItems="center" column={column} gap={column ? 4 : 8}>
        {(isError || isSuccess) && (
          <Icon
            size={18}
            {...icon}
            icon={isError ? "iWarningCircle" : "iCheckCircle"}
          />
        )}
        {isLoading && <Icon spinner size={18} />}
        <Text
          type={textType || "Subheadline"}
          style={{ order: reversed ? -1 : 0 }}
        >
          {promise.text ||
            (isError ? "Error" : isSuccess ? "Success" : "Loading...")}
        </Text>
      </View>
    );
  }

  return (
    <View alignItems="center" column={column} gap={column ? 4 : 8}>
      {icon && <Icon size={column ? 22 : 18} {...icon} />}
      {text && (
        <Text
          type={textType || (column ? "Caption1" : "Subheadline")}
          style={{ order: reversed ? -1 : 0 }}
        >
          {text}
        </Text>
      )}
    </View>
  );
}

export function Button({
  themePreset,
  background,
  color,
  themeInteractive,
  selected,
  border,
  radius,
  shadow,
  icon,
  pressable,
  textType,
  sizeFull,
  promise,
  text,
  style,
  className,
  column,
  padding,
  paddingHorizontal,
  paddingVertical,
  modal,
  iconEnd,
  "data-color-mode": dataColorMode,
  reversed,
}: ButtonProps) {
  const resolvedIconEnd = resolveButtonEndIcon(iconEnd);
  const isDisabledByPromise =
    promise?.type === "loading" ||
    promise?.type === "error" ||
    promise?.type === "success";
  const resolvedRadius = radius ?? (modal ? "Circle" : "Regular");
  const resolvedPreset = themePreset ?? "UIPrimary";

  if (resolvedIconEnd) {
    return (
      <View
        data-color-mode={dataColorMode}
        background={background}
        color={color}
        border={border}
        radius={resolvedRadius}
        shadow={shadow}
        className={className}
        fullWidth={modal || sizeFull}
        width={modal || sizeFull ? undefined : "max-content"}
        alignItems="stretch"
        gap={0}
        style={{
          overflow: "hidden",
          ...style,
        }}
      >
        {}
        <Pressable
          {...pressable}
          themePreset={resolvedPreset}
          themeInteractive={themeInteractive ?? true}
          selected={selected}
          disabled={isDisabledByPromise || pressable?.disabled}
          className={pressable?.className}
          alignItems="center"
          justifyContent="center"
          padding={modal ? 16 : (padding ?? 12)}
          paddingHorizontal={paddingHorizontal}
          paddingVertical={paddingVertical}
          style={{
            position: "relative",
            textAlign: "center",
            flex: "1 1 auto",
            height: "auto",
            ...pressable?.style,
          }}
          title={pressable?.title}
        >
          <ButtonContent
            icon={icon}
            text={text}
            textType={textType}
            column={column}
            reversed={reversed}
            promise={promise}
          />
          <Divider
            vertical
            style={{
              position: "absolute",
              right: 0,
              top: "18%",
              bottom: "18%",
              width: ".1rem",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        </Pressable>

        {}
        <Pressable
          {...resolvedIconEnd.pressable}
          themePreset={resolvedIconEnd.pressable?.themePreset ?? resolvedPreset}
          themeInteractive={
            resolvedIconEnd.pressable?.themeInteractive ??
            themeInteractive ??
            true
          }
          selected={resolvedIconEnd.pressable?.selected ?? selected}
          onClick={(event) => {
            if (
              !resolvedIconEnd.pressable?.popover &&
              !resolvedIconEnd.pressable?.href
            ) {
              event.preventDefault();
            }
            event.stopPropagation();
            resolvedIconEnd.pressable?.onClick?.(event as never);
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
            resolvedIconEnd.pressable?.onMouseDown?.(event);
          }}
          disabled={isDisabledByPromise || resolvedIconEnd.pressable?.disabled}
          className={resolvedIconEnd.pressable?.className}
          padding="0 .8rem"
          alignItems="center"
          justifyContent="center"
          style={{
            display: "inline-flex",
            flex: "0 0 auto",
            height: "auto",
            ...resolvedIconEnd.pressable?.style,
          }}
        >
          <Icon
            size={resolvedIconEnd.size ?? 20}
            border="None"
            icon={resolvedIconEnd.icon}
            svg={resolvedIconEnd.svg}
          />
        </Pressable>
      </View>
    );
  }

  const {
    className: pressableClassName,
    style: pressableStyle,
    title: pressableTitle,
    disabled: pressableDisabled,
    ...restPressable
  } = pressable ?? {};

  return (
    <Pressable
      data-color-mode={dataColorMode}
      {...restPressable}
      themePreset={resolvedPreset}
      background={background}
      color={color}
      themeInteractive={themeInteractive}
      selected={selected}
      border={border}
      radius={resolvedRadius}
      shadow={shadow}
      className={clsx(className, pressableClassName)}
      disabled={isDisabledByPromise || pressableDisabled}
      padding={modal ? 16 : (padding ?? 12)}
      paddingHorizontal={paddingHorizontal}
      paddingVertical={paddingVertical}
      fullWidth={modal || sizeFull}
      width={modal || sizeFull ? undefined : "max-content"}
      column={column}
      alignItems="center"
      justifyContent="center"
      height="max-content"
      gap={column ? 6 : 8}
      style={{
        position: "relative",
        textAlign: "center",
        ...style,
        ...pressableStyle,
      }}
      title={pressableTitle}
    >
      <ButtonContent
        icon={icon}
        text={text}
        textType={textType}
        column={column}
        reversed={reversed}
        promise={promise}
      />
    </Pressable>
  );
}

export default Button;
