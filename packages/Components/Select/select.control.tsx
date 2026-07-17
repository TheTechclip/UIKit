"use client";
import type {
  KeyboardEvent,
  ReactElement,
  MouseEvent as ReactMouseEvent,
} from "react";
import Pill from "../Pill/Pill";
import SelectTrigger from "./Select.trigger";
import type { SelectNavigation } from "./hooks/useSelectNavigation";
import type { SelectState } from "./hooks/useSelectState";
import type { SelectValue } from "./Select.types";
import { filterOptionsByQuery } from "./Select.utils";
import Text from "../Text/Text";
import View from "../../Frameworks/View/View";

interface SelectControlProps {
  state: SelectState;
  emitNativeChange: (next: SelectValue<boolean>) => void;
  removeSelectedOption: (value: string) => void;
  navigation: SelectNavigation;
}

export default function SelectControl({
  state,
  emitNativeChange,
  removeSelectedOption,
  navigation,
}: SelectControlProps): ReactElement {
  const { props, t } = state;
  const {
    isMultiple,
    isInlineComboboxActive,
    isInteractionDisabled,
    open,
    activeIndex,
    query,
    inputValue,
    selectedValues,
    selectedOptions,
    selectedLabel,
    selectedOptionLabel,
    flatOptions,
    getFirstEnabledIndex,
    getInitialActiveIndex,
    scheduleEnsureControlVisible,
    setOpen,
    setOpenSource,
    setActiveIndex,
    setSelectedValues,
    setQuery,
    setInputValue,
    listId,
    selectId,
    visibleOptions,
  } = state;

  const {
    placeholder,
    title,
    disabled,
    readOnly,
    required,
  } = props;

  const {
    handleControlKeyDown,
    handleTriggerClick,
    handleTriggerPointerUp,
  } = navigation;

  const selectedPills =
    isMultiple && selectedOptions.length > 0 ? (
      <View wrap="wrap" gap={6} data-select-pills>
        {selectedOptions.map((option, index) => (
          <Pill
            key={String(option.value)}
            text={option.label}
            disabled={isInteractionDisabled}
            paddingVertical={6}
            paddingHorizontal={8}
            themePreset="BaseFull"
            background={props.background}
            color={props.color}
            rightIcon={
              isInteractionDisabled
                ? undefined
                : {
                    icon: "iClose",
                    pressable: {
                      tabIndex: -1,
                      onMouseDown: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      },
                      onKeyDown: (e: KeyboardEvent<Element>) => {
                        if (e.key === "ArrowLeft") {
                          e.preventDefault();
                          e.stopPropagation();
                          if (index > 0) {
                            navigation.focusPillButton(index - 1);
                          } else {
                            navigation.focusInputField();
                          }
                          return;
                        }
                        if (e.key === "ArrowRight") {
                          e.preventDefault();
                          e.stopPropagation();
                          if (index < selectedOptions.length - 1) {
                            navigation.focusPillButton(index + 1);
                          } else {
                            navigation.focusInputField();
                          }
                          return;
                        }
                        if (e.key !== "Backspace" && e.key !== "Delete") return;
                        e.preventDefault();
                        e.stopPropagation();
                        navigation.focusInputField();
                        removeSelectedOption(String(option.value));
                      },
                      onClick: (e: ReactMouseEvent<Element>) => {
                        e.stopPropagation();
                        removeSelectedOption(String(option.value));
                      },
                    },
                  }
            }
          />
        ))}
      </View>
    ) : null;

  const placeholderText = placeholder ?? t.UIKit.ui.select;

  const renderComboboxControl = () => (
    <View
      style={{
        width: "calc(100% + 2.8rem)",
        textAlign: "left",
        cursor: "default",
      }}
      column
      gap={4}
    >
      {selectedPills}
      <input
        id={selectId}
        data-select-input="true"
        title={title}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-activedescendant={
          open && activeIndex >= 0 && activeIndex < visibleOptions.length
            ? `${listId}-${activeIndex}`
            : undefined
        }
        value={isMultiple ? query : inputValue}
        placeholder={
          isMultiple && selectedOptions.length > 0
            ? undefined
            : placeholderText
        }
        className="Subheadline"
        onFocus={() => {
          if (isInteractionDisabled) return;
          if (document.activeElement?.matches(":focus-visible")) {
            setOpenSource("keyboard");
          }
          setOpen(true);
          scheduleEnsureControlVisible();
          setActiveIndex((prev) => {
            if (prev >= 0 && !visibleOptions[prev]?.disabled) return prev;
            return getInitialActiveIndex(visibleOptions);
          });
        }}
        onClick={() => {
          if (isInteractionDisabled) return;
          setOpen(true);
          scheduleEnsureControlVisible();
        }}
        onChange={(e) => {
          if (isInteractionDisabled) return;
          const nextQuery = e.target.value;
          setOpenSource("keyboard");
          if (!isMultiple) {
            if (selectedValues.length > 0 && nextQuery !== selectedOptionLabel) {
              setSelectedValues([]);
              emitNativeChange("" as SelectValue<boolean>);
            }
            setInputValue(nextQuery);
          }
          setQuery(nextQuery);
          props.onInputChange?.(nextQuery);
          setOpen(true);
          const nextVisible = filterOptionsByQuery(flatOptions, nextQuery);
          setActiveIndex(getFirstEnabledIndex(nextVisible));
        }}
        onKeyDown={(e) => handleControlKeyDown(e, false)}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
      />
    </View>
  );

  if (isInlineComboboxActive) return renderComboboxControl();

  return (
    <SelectTrigger
      selectId={selectId}
      title={title}
      open={open}
      listId={listId}
      isMultiple={isMultiple}
      isInteractionDisabled={isInteractionDisabled}
      selectedPills={selectedPills}
      selectedOptionsLength={selectedOptions.length}
      selectedLabel={selectedLabel}
      placeholderText={placeholderText}
      handleTriggerClick={handleTriggerClick}
      handleTriggerPointerUp={handleTriggerPointerUp}
      handleControlKeyDown={handleControlKeyDown}
    />
  );
}
