"use client";

import { useTimeout } from "@musecat/functionkit";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "@/packages/Components/Icon/Icon";
import { useNavDrag } from "@/packages/Components/Nav/hooks/useNavDrag";
import { useNavIndicator } from "@/packages/Components/Nav/hooks/useNavIndicator";
import styles from "@/packages/Components/Nav/Nav.module.scss";
import type { NavProps } from "@/packages/Components/Nav/Nav.types";
import Text from "@/packages/Components/Text/Text";
import Pressable from "@/packages/Frameworks/Pressable/Pressable";
import View from "@/packages/Frameworks/View/View";

export default function Nav({
  name,
  items,
  className,
  radius,
  padding,
  paddingHorizontal,
  paddingVertical,
  sizeFull,
  radio,
  dragSelection = true,
  dragSelectionCommit = "end",
  value,
  defaultValue,
  onChange,
  titleType,
  titleSize,
  style,
  "data-color-mode": dataTheme,
}: NavProps) {
  const [internalValue, setInternalValue] = useState<
    string | number | undefined
  >(radio ? defaultValue : undefined);
  const isControlled = value !== undefined;
  const currentCheckedValue = isControlled ? value : internalValue;
  const [dragPreviewValue, setDragPreviewValue] = useState<
    string | number | undefined
  >();
  const displayCheckedValue =
    dragPreviewValue !== undefined ? dragPreviewValue : currentCheckedValue;

  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [isDraggingSelection, setIsDraggingSelection] = useState(false);
  const [isReleasingSelection, setIsReleasingSelection] = useState(false);
  const [pressed, setPressed] = useState(false);
  const committedSelectedIndex = items.findIndex(
    (item) =>
      item.checked ??
      (item.value !== undefined &&
        currentCheckedValue !== undefined &&
        item.value === currentCheckedValue),
  );

  const { applyIndicatorStyle, committedIndicatorStyleRef } = useNavIndicator(
    committedSelectedIndex,
    isDraggingSelection,
    isReleasingSelection,
    itemRefs,
    indicatorRef,
    navRef,
  );

  const dragReleaseTimer = useTimeout(
    () => {
      setDragPreviewValue(undefined);
      setIsReleasingSelection(false);
      applyIndicatorStyle(committedIndicatorStyleRef.current);
    },
    240,
    { enabled: false },
  );

  const getDefaultItemPadding = useCallback(
    (item: NavProps["items"][number]) =>
      item.icon && item.title ? ".8rem 1.2rem .8rem 1rem" : ".8rem 1.2rem",
    [],
  );

  const router = useRouter();

  const selectValue = useCallback(
    (nextValue: string | number | undefined) => {
      if (nextValue === undefined || nextValue === currentCheckedValue) {
        return;
      }

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue);

      const item = items.find((i) => i.value === nextValue);
      if (!item) return;

      const fakeEvent = {
        preventDefault: () => {},
        stopPropagation: () => {},
      } as React.MouseEvent;

      item.onClick?.(fakeEvent);

      if (item.href) {
        const href = item.href;
        const isExternal =
          typeof href === "string" &&
          (href.startsWith("//") || /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(href));
        if (isExternal || item.target === "_blank") {
          window.open(
            typeof href === "string" ? href : (href.pathname ?? ""),
            item.target ?? "_blank",
            item.rel,
          );
        } else {
          router.push(href as string);
        }
      }
    },
    [currentCheckedValue, isControlled, onChange, items, router],
  );

  const {
    handlePointerDown,
    handlePointerMove,
    stopDragging,
    canDragSelection,
    dragStartFrameRef,
    dragMoveFrameRef,
  } = useNavDrag({
    items,
    itemRefs,
    dragSelection: dragSelection ?? false,
    radio: radio ?? false,
    dragSelectionCommit,
    selectValue,
    setDragPreviewValue,
    applyIndicatorStyle,
    committedIndicatorStyleRef,
    setIsDraggingSelection,
    setIsReleasingSelection,
    setPressed,
    dragReleaseTimer,
  });

  useEffect(
    () => () => {
      if (dragStartFrameRef.current !== null) {
        cancelAnimationFrame(dragStartFrameRef.current);
      }

      if (dragMoveFrameRef.current !== null) {
        cancelAnimationFrame(dragMoveFrameRef.current);
      }

      dragReleaseTimer.clear();
    },
    [dragReleaseTimer, dragStartFrameRef, dragMoveFrameRef],
  );

  return (
    <View
      ref={navRef}
      data-color-mode={dataTheme}
      className={clsx(
        styles.Nav,
        sizeFull && styles.SizeFull,
        canDragSelection && styles.DragSelection,
        isDraggingSelection && styles.Dragging,
        className,
      )}
      gap={0}
      background="Base6TP6"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      onPointerLeave={() => {
        setPressed(false);
      }}
      style={style}
    >
      {}
      <View
        radius={radius ?? "Circle"}
        data-color-mode={dataTheme}
        background="Base1"
        ref={indicatorRef}
        className={clsx(
          styles.ActiveIndicator,
          isDraggingSelection && styles.ActiveIndicatorDragging,
          isReleasingSelection && styles.ActiveIndicatorReleasing,
          pressed && !isDraggingSelection && styles.ActiveIndicatorPressed,
        )}
      />
      {items.map((item, index) => {
        const {
          checked: itemChecked,
          icon: itemIcon,
          title: itemTitle,
          children: itemChildren,
          className: itemClassName,
          onChange: itemOnChange,
          ...restItem
        } = item;
        const isChecked =
          itemChecked ??
          (item.value !== undefined &&
            displayCheckedValue !== undefined &&
            item.value === displayCheckedValue);
        const nextValue = item.value;
        const itemKey =
          nextValue ??
          itemTitle ??
          itemIcon?.icon ??
          itemIcon?.svg ??
          itemIcon?.image;

        if (!itemTitle && itemIcon) {
          return (
            <Icon
              key={String(itemKey)}
              box
              iconFill={itemIcon.iconFill ?? isChecked}
              boxOptions={{
                padding,
                paddingHorizontal,
                paddingVertical,
                ...itemIcon.boxOptions,
              }}
              className={clsx(styles.Item, isChecked && styles.Checked)}
              pressable={{
                ref: (el) => {
                  itemRefs.current[index] = el;
                },
                type: radio ? "radio" : undefined,
                name: name,
                checked: isChecked,
                themeInteractive: false,
                "data-color-mode": dataTheme,
                onChange: (e) => {
                  selectValue(nextValue);
                  itemOnChange?.(e);
                },
              }}
              {...itemIcon}
            />
          );
        }

        return (
          <Pressable
            key={String(itemKey)}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            className={clsx(
              styles.Item,
              isChecked && styles.Checked,
              itemClassName,
            )}
            type={radio ? "radio" : undefined}
            name={name}
            {...restItem}
            themeInteractive={false}
            data-color-mode={dataTheme}
            checked={isChecked}
            onChange={(e) => {
              selectValue(nextValue);
              itemOnChange?.(e);
            }}
            padding={
              padding !== undefined ? padding : getDefaultItemPadding(item)
            }
            paddingHorizontal={paddingHorizontal}
            paddingVertical={paddingVertical}
          >
            {itemIcon && (
              <Icon
                size={itemIcon.size ?? 22}
                iconFill={itemIcon.iconFill ?? isChecked}
                {...itemIcon}
                pressable={undefined}
              />
            )}
            {itemTitle && (
              <Text type={titleType ?? "Headline"} size={titleSize}>
                {itemTitle}
              </Text>
            )}
            {itemChildren}
          </Pressable>
        );
      })}
    </View>
  );
}
