"use client";
import type { KeyboardEvent, ReactElement } from "react";
import Text from "../Text/Text";
import Pressable from "../../Frameworks/Pressable/Pressable";
import View from "../../Frameworks/View/View";

interface SelectTriggerProps {
  selectId: string;
  title?: string;
  open: boolean;
  listId: string;
  isMultiple: boolean;
  isInteractionDisabled: boolean;
  selectedPills: ReactElement | null;
  selectedOptionsLength: number;
  selectedLabel: string;
  placeholderText: string;
  handleTriggerClick: () => void;
  handleTriggerPointerUp: (e: any) => void;
  handleControlKeyDown: (e: KeyboardEvent, isControl: boolean) => void;
}

export default function SelectTrigger({
  selectId,
  title,
  open,
  listId,
  isMultiple,
  isInteractionDisabled,
  selectedPills,
  selectedOptionsLength,
  selectedLabel,
  placeholderText,
  handleTriggerClick,
  handleTriggerPointerUp,
  handleControlKeyDown,
}: SelectTriggerProps): ReactElement {
  return (
    <View
      style={{
        width: isMultiple ? "calc(100% + 2.8rem)" : undefined,
        textAlign: "left",
        cursor: "default",
      }}
      column={isMultiple}
      gap={isMultiple ? 4 : undefined}
    >
      {isMultiple && selectedPills}
      {isMultiple && selectedOptionsLength === 0 ? (
        <Pressable
          id={selectId}
          data-select-trigger="true"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          title={title}
          style={{ cursor: "default" }}
          themeInteractive={false}
          onClick={handleTriggerClick}
          onPointerUp={(e) => handleTriggerPointerUp(e as any)}
          onKeyDown={(e) => handleControlKeyDown(e as any, true)}
          disabled={isInteractionDisabled}
        >
          <Text type="Subheadline">{placeholderText}</Text>
        </Pressable>
      ) : !isMultiple ? (
        <Pressable
          id={selectId}
          data-select-trigger="true"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listId}
          title={title}
          style={{ cursor: "default" }}
          themeInteractive={false}
          onClick={handleTriggerClick}
          onPointerUp={(e) => handleTriggerPointerUp(e as any)}
          onKeyDown={(e) => handleControlKeyDown(e as any, true)}
          disabled={isInteractionDisabled}
        >
          <Text type="Subheadline">{selectedLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
