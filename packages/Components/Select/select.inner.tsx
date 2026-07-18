"use client";

import {
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
  useMemo,
} from "react";
import ContextMenu from "../ContextMenu/ContextMenu";
import Icon from "../Icon/Icon";
import Label from "../Label/Label";
import { useSelectNavigation } from "./hooks/useSelectNavigation";
import { useSelectSelection } from "./hooks/useSelectSelection";
import { useSelectState } from "./hooks/useSelectState";
import type { SelectProps } from "./Select.types";
import { filterOptionsByQuery } from "./Select.utils";
import SelectControl from "./select.control";
import View from "../../Frameworks/View/View";

export default function SelectInner(props: SelectProps<boolean>): ReactElement {
  const state = useSelectState(props);
  const isSheet = state.isMobileSheet;
  const selection = useSelectSelection(state);
  const navigation = useSelectNavigation(state, selection);

  const {
    t,
    isMultiple,
    isTypeableControl,
    isInteractionDisabled,
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    openSource,
    setOpenSource,
    selectedValues,
    query,
    inputValue,
    selectId,
    listId,
    popoverOwnerId,
    rootRef,
    controlRef,
    pointerDownInsidePopoverRef,
    isPopoverSearchActive,
    visibleOptions,
    flatOptions,
    getFirstEnabledIndex,
    isInOwnPopover,
    isOptionSelectionDisabled,
    props: rawProps,
  } = state;

  const { onInputChange } = rawProps;
  const {
    selectOption,
    removeSelectedOption,
    clearSelection,
    emitNativeChange,
  } = selection;

  const contextMenuContents = useMemo(
    () =>
      visibleOptions.map((option) => {
        const value = String(option.value);
        const isSelected = selectedValues.includes(value);
        return {
          type: "option" as const,
          value: option.value,
          label: option.label,
          icon: option.icon,
          description: option.description,
          disabled: isOptionSelectionDisabled(option),
          selected: isSelected,
          onClick: () => selectOption(option),
        };
      }),
    [visibleOptions, selectedValues, isOptionSelectionDisabled, selectOption],
  );

  const searchInputContent = isPopoverSearchActive ? (
    <label
      style={{
        width: "100%",
        padding: isSheet ? "0 .8rem .8rem .8rem" : undefined,
      }}
    >
      <View
        padding={isSheet ? [12, 16] : [6, 8]}
        radius={isSheet ? "Circle" : undefined}
        themePreset={isSheet ? "BaseFull" : undefined}
        gap={8}
        width="100%"
      >
        <Icon icon="iSearch" size={20} opacity={0.8} />
        <input
          ref={state.popoverInputRef}
          type="text"
          style={{ width: "100%" }}
          className="Subheadline"
          value={query}
          placeholder={`${t.UIKit.ui.select}...`}
          onFocus={() => {
            if (isInteractionDisabled) return;
            state.setOpenSource("keyboard");
          }}
          onChange={(e) => {
            if (isInteractionDisabled) return;
            const val = e.target.value;
            state.setOpenSource("keyboard");
            state.setQuery(val);
            onInputChange?.(val);
            const nextVisible = filterOptionsByQuery(flatOptions, val);
            state.setActiveIndex(getFirstEnabledIndex(nextVisible));
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              const triggerEl = isTypeableControl
                ? (controlRef.current?.querySelector(
                    'input[data-select-input="true"]',
                  ) as HTMLElement | null)
                : (controlRef.current?.querySelector(
                    'button[data-select-trigger="true"]',
                  ) as HTMLElement | null);
              triggerEl?.focus();
            }
            if (e.key === "Backspace" && !query && isMultiple) {
              e.preventDefault();
              removeSelectedOption(
                selectedValues[selectedValues.length - 1] ?? "",
              );
            }
          }}
        />
      </View>
    </label>
  ) : undefined;

  return (
    <Label
      data-color-mode={rawProps["data-color-mode"]}
      htmlFor={selectId}
      title={rawProps.title}
      required={rawProps.required}
      hint={rawProps.hint}
      disabled={rawProps.disabled}
      readOnly={rawProps.readOnly}
      themePreset={rawProps.themePreset}
      background={rawProps.background}
      color={rawProps.color}
      themeInteractive={rawProps.themeInteractive}
      selected={rawProps.selected}
      border={rawProps.border}
      radius={rawProps.radius}
      className={rawProps.className}
      style={rawProps.style}
      cursor={isTypeableControl ? "text" : undefined}
    >
      <View
        data-color-mode={rawProps["data-color-mode"]}
        ref={rootRef}
        onKeyDownCapture={(e) => {
          if (e.key === "Tab") {
            state.lastClosedByTabRef.current = true;
            setTimeout(() => {
              state.lastClosedByTabRef.current = false;
            }, 100);

            const ownerEl = document.querySelector(
              `[data-popover-owner="${popoverOwnerId}"]`,
            );
            if (ownerEl) {
              const focusable = Array.from(
                ownerEl.querySelectorAll(
                  'input, button, select, textarea, [tabindex="0"], [role="option"]',
                ),
              ).filter((el) => {
                const style = window.getComputedStyle(el);
                return (
                  style.display !== "none" &&
                  style.visibility !== "hidden" &&
                  !(el as any).disabled
                );
              }) as HTMLElement[];

              if (focusable.length > 0) {
                const activeEl = document.activeElement as HTMLElement | null;
                const index = focusable.indexOf(activeEl!);

                if (e.shiftKey) {
                  if (index === 0 || index === -1) {
                    e.preventDefault();
                    setOpen(false);
                    const triggerEl = isTypeableControl
                      ? (controlRef.current?.querySelector(
                          'input[data-select-input="true"]',
                        ) as HTMLElement | null)
                      : (controlRef.current?.querySelector(
                          'button[data-select-trigger="true"]',
                        ) as HTMLElement | null);
                    triggerEl?.focus();
                  }
                } else {
                  if (index === focusable.length - 1) {
                    setOpen(false);
                  }
                }
              }
            }
          }
        }}
        onBlur={(e) => {
          const next = e.relatedTarget as Node | null;
          if (pointerDownInsidePopoverRef.current) return;
          if (next && (rootRef.current?.contains(next) || isInOwnPopover(next)))
            return;
          setOpen(false);
        }}
      >
        <View
          data-color-mode={rawProps["data-color-mode"]}
          ref={controlRef}
          width="100%"
          alignItems="flex-end"
          justifyContent="space-between"
          gap={6}
        >
          <SelectControl
            state={state}
            emitNativeChange={emitNativeChange}
            removeSelectedOption={removeSelectedOption}
            navigation={navigation}
          />

          <View alignItems="center" gap={4} style={{ margin: "-.2rem" }}>
            {(isTypeableControl || isMultiple) &&
              !isInteractionDisabled &&
              (selectedValues.length > 0 ||
                query ||
                (!isMultiple && inputValue)) && (
                <Icon
                  icon="iClose"
                  size={16}
                  opacity={0.8}
                  box
                  boxOptions={{ padding: ".4rem" }}
                  pressable={{
                    onMouseDown: (e: ReactMouseEvent<Element>) => {
                      e?.preventDefault?.();
                      e?.stopPropagation?.();
                    },
                    onClick: (e: ReactMouseEvent<Element>) => {
                      e?.preventDefault?.();
                      e?.stopPropagation?.();
                      clearSelection();
                    },
                  }}
                />
              )}
            <Icon
              icon="iArrowKeyDown"
              opacity={0.8}
              boxOptions={{ padding: ".4rem" }}
              size={16}
            />
          </View>
        </View>

        <ContextMenu
          open={open}
          onOpenChange={setOpen}
          anchorRef={controlRef as React.RefObject<HTMLElement>}
          popoverOwnerId={popoverOwnerId}
          listId={listId}
          isInteractionDisabled={isInteractionDisabled}
          contents={contextMenuContents}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          openSource={openSource}
          onOpenSourceChange={setOpenSource}
          showCheck
          recalcKey={`${selectedValues.join("|")}|${visibleOptions.length}|${openSource}|${isMultiple}|${query}|${inputValue}`}
          popoverConfig={{
            matchAnchorWidth: true,
            offset: { x: "-1.6rem", width: "3.2rem" },
            strategy:
              isTypeableControl || isPopoverSearchActive || isMultiple
                ? "anchored"
                : "center-selected",
            selectedItemSelector: '[data-selected="true"]',
            gap: 2,
            maxHeight: 380,
            header: isPopoverSearchActive
              ? {
                  content: searchInputContent,
                }
              : undefined,
          }}
          sheetConfig={{
            header: isPopoverSearchActive
              ? {
                  content: searchInputContent,
                }
              : undefined,
          }}
          mobileMode="sheet"
        />
      </View>
    </Label>
  );
}
