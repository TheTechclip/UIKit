"use client";

import {
  type KeyboardEvent,
  type MouseEvent,
  memo,
  type ReactElement,
} from "react";
import Pressable from "../../frameworks/Pressable/Pressable";
import View from "../../frameworks/View/View";
import Icon from "../Icon/Icon";
import Text from "../Text/Text";
import styles from "./ContextMenu.module.scss";
import type { ContentItem } from "./ContextMenu.types";

export interface ContextMenuOptionProps {
  item: ContentItem;
  index: number;
  listId: string;
  openSource: "mouse" | "keyboard";
  activeIndex: number;
  isInteractionDisabled: boolean;
  isOptionDisabled: (option: ContentItem) => boolean;
  setOpenSource: (source: "mouse" | "keyboard") => void;
  setActiveIndex: (index: number) => void;
  selectOption: () => void;
  isSheetMode?: boolean;
  showCheck?: boolean;
}

const ContextMenuOption = memo(function ContextMenuOption(
  props: ContextMenuOptionProps,
): ReactElement {
  const {
    item,
    index,
    listId,
    openSource,
    activeIndex,
    isInteractionDisabled,
    isOptionDisabled,
    setOpenSource,
    setActiveIndex,
    selectOption,
    showCheck,
    isSheetMode,
  } = props;
  const isSelected = !!item.selected;
  const isActive = openSource === "keyboard" && index === activeIndex;
  const isDisabled = isInteractionDisabled || isOptionDisabled(item);

  const onMouseEnter = () => {
    if (isDisabled) return;
    setOpenSource("mouse");
    setActiveIndex(index);
  };

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDisabled) return;
    selectOption();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (isDisabled) return;
      selectOption();
    }
  };

  return (
    <Pressable
      id={`${listId}-${index}`}
      className={styles.OptionItem}
      role="option"
      aria-selected={isSelected}
      data-selected={isSelected ? "true" : "false"}
      data-active={isActive ? "true" : "false"}
      data-disabled={isDisabled ? "true" : "false"}
      themeInteractive={!isDisabled}
      disabled={isDisabled}
      radius={isSheetMode ? "Light" : "ExtraLight"}
      onMouseEnter={onMouseEnter}
      onMouseDown={onMouseDown}
      onClick={onClick}
      onKeyDown={onKeyDown}
      alignItems="center"
      gap={8}
      width="100%"
      padding={isSheetMode ? [12, 16] : [6, 12]}
    >
      {showCheck && (
        <Icon
          icon="iCheck"
          size={16}
          style={{ flex: "none" }}
          opacity={isSelected ? 1 : 0}
        />
      )}
      <View gap={6} alignItems="center">
        {item.icon && <Icon icon={item.icon} size={16} />}
        <View column gap={2}>
          <Text type="Subheadline">{item.label}</Text>
          {item.description && (
            <Text
              type="Caption2"
              style={{ color: "var(--ds-gray-700, currentColor)" }}
            >
              {item.description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
});

export default ContextMenuOption;
