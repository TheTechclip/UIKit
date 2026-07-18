"use client";
import { useTimeout } from "@musecat/functionkit";
import {
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
} from "react";
import type { SelectState } from "./useSelectState";
import {
  handleEndKey,
  handleHomeKey,
  isPrintableCharacter,
  useTypeAhead,
} from "../Select.keyboard";
import type { Option } from "../Select.types";
import {
  findScrollableAncestor,
  lockScrollElementSafe,
  unlockScrollElementSafe,
} from "../Select.utils";

export function useSelectNavigation(
  state: SelectState,
  selection: { removeSelectedOption: (value: string) => void },
) {
  const {
    isMultiple,
    isPopoverSearchActive,
    isTypeableControl,
    isInteractionDisabled,
    lockAncestorScrollOnOpen,
    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    query,
    setOpenSource,
    selectedValues,
    visibleOptions,
    rootRef,
    controlRef,
    suppressOpenUntilRef,
    suppressClickUntilRef,
    popoverInputRef,
    pointerDownInsidePopoverRef,
    lastClosedByTabRef,
    isFirstRenderRef,
    selectedOptions,
    isInOwnPopover,
    getFirstEnabledIndex,
    getNextEnabledIndex,
    getSelectedEnabledIndex,
    getInitialActiveIndex,
    isOptionSelectionDisabled,
  } = state;

  useEffect(() => {
    if (!lockAncestorScrollOnOpen || !open) return;
    const scrollAncestor = findScrollableAncestor(controlRef.current);
    if (!scrollAncestor) return;
    lockScrollElementSafe(scrollAncestor);
    return () => {
      unlockScrollElementSafe(scrollAncestor);
    };
  }, [lockAncestorScrollOnOpen, open, controlRef]);

  useEffect(() => {
    if (open && isPopoverSearchActive) {
      const timer = setTimeout(() => {
        popoverInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open, isPopoverSearchActive, popoverInputRef]);

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    if (!open) {
      if (lastClosedByTabRef.current) return;
      if (isTypeableControl) return;
      const targetEl = controlRef.current?.querySelector(
        'button[data-select-trigger="true"]',
      ) as HTMLElement | null;
      if (targetEl) {
        requestAnimationFrame(() => {
          targetEl.focus();
        });
      }
    }
  }, [
    open,
    isTypeableControl,
    controlRef,
    isFirstRenderRef,
    lastClosedByTabRef,
  ]);

  const clearPointerDownFlagTimer = useTimeout(
    () => {
      pointerDownInsidePopoverRef.current = false;
    },
    0,
    { enabled: false },
  );
  useEffect(() => {
    const markPointerDownInPopover = (event: MouseEvent | TouchEvent) => {
      pointerDownInsidePopoverRef.current = isInOwnPopover(event.target);
      clearPointerDownFlagTimer.start(0);
    };
    document.addEventListener("mousedown", markPointerDownInPopover, true);
    document.addEventListener("touchstart", markPointerDownInPopover, true);
    return () => {
      document.removeEventListener("mousedown", markPointerDownInPopover, true);
      document.removeEventListener(
        "touchstart",
        markPointerDownInPopover,
        true,
      );
      clearPointerDownFlagTimer.clear();
    };
  }, [isInOwnPopover, clearPointerDownFlagTimer, pointerDownInsidePopoverRef]);

  useEffect(() => {
    const onOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      const label = rootRef.current?.closest("label");
      if (
        label?.contains(target) ||
        rootRef.current?.contains(target) ||
        isInOwnPopover(target)
      )
        return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    document.addEventListener("touchstart", onOutside);
    return () => {
      document.removeEventListener("mousedown", onOutside);
      document.removeEventListener("touchstart", onOutside);
    };
  }, [isInOwnPopover, rootRef, setOpen]);

  const shouldAllowLabelPointerDefault = useCallback(
    (target: EventTarget | null) => {
      const element = target as HTMLElement | null;
      if (!element) return false;
      const control = controlRef.current;
      if (!control?.contains(element)) return false;
      if (isTypeableControl) {
        return element.closest('input,button,[role="button"]') !== null;
      }
      return element.closest("button") !== null;
    },
    [isTypeableControl, controlRef],
  );

  useEffect(() => {
    if (isInteractionDisabled) return;
    const label = rootRef.current?.closest("label");
    if (!label) return;
    const isBypassTarget = (target: EventTarget | null) => {
      const element = target as HTMLElement | null;
      if (!element) return false;
      const isInteractiveControl = shouldAllowLabelPointerDefault(target);
      const isPopoverInteraction = isInOwnPopover(target);
      return isInteractiveControl || isPopoverInteraction;
    };
    const toggleFromLabelClick = () => {
      if (isInteractionDisabled) return;
      if (isTypeableControl) {
        const inputEl = controlRef.current?.querySelector(
          'input[data-select-input="true"]',
        ) as HTMLInputElement | null;
        if (open) {
          setOpen(false);
          return;
        }
        setOpenSource("mouse");
        setOpen(true);
        setActiveIndex((prev) => {
          if (prev >= 0 && !visibleOptions[prev]?.disabled) return prev;
          return getInitialActiveIndex(visibleOptions);
        });
        inputEl?.focus();
        return;
      }
      if (Date.now() < suppressOpenUntilRef.current) return;
      const buttonEl = controlRef.current?.querySelector(
        'button[data-select-trigger="true"]',
      ) as HTMLButtonElement | null;
      setOpenSource("mouse");
      setOpen((prev) => {
        if (!prev) {
          const selectedEnabledIdx = getSelectedEnabledIndex(visibleOptions);
          const fallbackIdx = getFirstEnabledIndex(visibleOptions);
          setActiveIndex(
            selectedEnabledIdx >= 0 ? selectedEnabledIdx : fallbackIdx,
          );
        }
        return !prev;
      });
      buttonEl?.focus();
    };
    const handlePointerDownCapture = (e: MouseEvent | TouchEvent) => {
      if (isBypassTarget(e.target)) return;
      e.preventDefault();
    };
    const handleClickCapture = (e: MouseEvent | TouchEvent) => {
      if (isBypassTarget(e.target)) return;
      e.preventDefault();
      suppressClickUntilRef.current = Date.now() + 400;
      toggleFromLabelClick();
    };
    label.addEventListener("mousedown", handlePointerDownCapture, true);
    label.addEventListener("touchstart", handlePointerDownCapture, true);
    label.addEventListener("click", handleClickCapture, true);
    label.addEventListener("touchend", handleClickCapture, true);
    return () => {
      label.removeEventListener("mousedown", handlePointerDownCapture, true);
      label.removeEventListener("touchstart", handlePointerDownCapture, true);
      label.removeEventListener("click", handleClickCapture, true);
      label.removeEventListener("touchend", handleClickCapture, true);
    };
  }, [
    getFirstEnabledIndex,
    getInitialActiveIndex,
    getSelectedEnabledIndex,
    isInteractionDisabled,
    isTypeableControl,
    open,
    isInOwnPopover,
    shouldAllowLabelPointerDefault,
    visibleOptions,
    controlRef,
    rootRef,
    setOpen,
    setOpenSource,
    setActiveIndex,
    suppressOpenUntilRef,
    suppressClickUntilRef,
  ]);

  const toggleOpenFromTrigger = useCallback(() => {
    if (isInteractionDisabled) return;
    if (Date.now() < suppressOpenUntilRef.current) return;
    setOpenSource("mouse");
    setOpen((prev) => {
      if (!prev) {
        const selectedEnabledIdx = getSelectedEnabledIndex(visibleOptions);
        const fallbackIdx = getFirstEnabledIndex(visibleOptions);
        setActiveIndex(
          selectedEnabledIdx >= 0 ? selectedEnabledIdx : fallbackIdx,
        );
      }
      return !prev;
    });
  }, [
    getFirstEnabledIndex,
    getSelectedEnabledIndex,
    isInteractionDisabled,
    visibleOptions,
    setOpen,
    setOpenSource,
    setActiveIndex,
    suppressOpenUntilRef,
  ]);

  const openWithKeyboard = useCallback(
    (items: Option[], direction: 1 | -1 | 0 = 0) => {
      if (isInteractionDisabled) return;
      setOpenSource("keyboard");
      setOpen(true);
      setActiveIndex(() => {
        const selectedIdx = getSelectedEnabledIndex(items);
        const base =
          selectedIdx >= 0 ? selectedIdx : getFirstEnabledIndex(items);
        if (direction !== 0 && selectedIdx >= 0) {
          return getNextEnabledIndex(items, base, direction);
        }
        return base;
      });
    },
    [
      getFirstEnabledIndex,
      getNextEnabledIndex,
      getSelectedEnabledIndex,
      isInteractionDisabled,
      setOpen,
      setOpenSource,
      setActiveIndex,
    ],
  );

  const focusInputField = useCallback(() => {
    const inputEl = controlRef.current?.querySelector(
      'input[data-select-input="true"]',
    ) as HTMLInputElement | null;
    inputEl?.focus();
  }, [controlRef]);

  const focusPillButton = useCallback(
    (index: number) => {
      const button = controlRef.current
        ?.querySelectorAll("[data-select-pills] button")
        ?.item(index) as HTMLButtonElement | undefined;
      if (!button) return false;
      button.focus();
      return true;
    },
    [controlRef],
  );

  const { handleTypeAhead } = useTypeAhead(
    visibleOptions,
    activeIndex,
    setActiveIndex,
    isOptionSelectionDisabled,
  );

  const handleControlKeyDown = useCallback(
    (e: KeyboardEvent<Element>, allowSpaceSelection: boolean) => {
      if (e.key === "Tab") {
        setOpen(false);
        return;
      }
      if (isInteractionDisabled) {
        return;
      }
      if (
        e.key === "Backspace" &&
        isMultiple &&
        !query &&
        selectedValues.length > 0
      ) {
        e.preventDefault();
        selection.removeSelectedOption(
          selectedValues[selectedValues.length - 1] ?? "",
        );
        return;
      }
      if (
        e.key === "ArrowLeft" &&
        isMultiple &&
        !query &&
        selectedOptions.length > 0
      ) {
        const inputEl = e.currentTarget as HTMLInputElement;
        const cursorStart = inputEl.selectionStart ?? 0;
        const cursorEnd = inputEl.selectionEnd ?? 0;
        if (cursorStart === 0 && cursorEnd === 0) {
          e.preventDefault();
          focusPillButton(selectedOptions.length - 1);
        }
        return;
      }
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!open) {
          openWithKeyboard(visibleOptions, e.key === "ArrowDown" ? 1 : -1);
        }
        return;
      }
      if (e.key === "Home") {
        if (isTypeableControl && !open) {
        } else {
          e.preventDefault();
          if (!open) {
            openWithKeyboard(visibleOptions);
          } else {
            const idx = handleHomeKey(
              visibleOptions,
              isOptionSelectionDisabled,
            );
            if (idx >= 0) setActiveIndex(idx);
          }
        }
        return;
      }
      if (e.key === "End") {
        if (isTypeableControl && !open) {
        } else {
          e.preventDefault();
          if (!open) {
            openWithKeyboard(visibleOptions);
          } else {
            const idx = handleEndKey(visibleOptions, isOptionSelectionDisabled);
            if (idx >= 0) setActiveIndex(idx);
          }
        }
        return;
      }
      if (open && !isTypeableControl && isPrintableCharacter(e.key)) {
        e.preventDefault();
        handleTypeAhead(e.key);
        return;
      }
      const isSelectionKey =
        e.key === "Enter" || (allowSpaceSelection && e.key === " ");
      if (!isSelectionKey) return;
      e.preventDefault();
      if (!open) {
        openWithKeyboard(visibleOptions);
        return;
      }
    },
    [
      focusPillButton,
      handleTypeAhead,
      isInteractionDisabled,
      isMultiple,
      isOptionSelectionDisabled,
      isTypeableControl,
      open,
      openWithKeyboard,
      query,
      selection,
      selectedOptions,
      selectedValues,
      setActiveIndex,
      visibleOptions,
      setOpen,
    ],
  );

  const handleTriggerClick = useCallback(() => {
    if (Date.now() < suppressClickUntilRef.current) return;
    toggleOpenFromTrigger();
  }, [toggleOpenFromTrigger, suppressClickUntilRef.current]);
  const handleTriggerPointerUp = useCallback(
    (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (e.pointerType !== "touch") return;
      e.preventDefault();
      suppressClickUntilRef.current = Date.now() + 400;
      toggleOpenFromTrigger();
    },
    [toggleOpenFromTrigger, suppressClickUntilRef],
  );

  return {
    toggleOpenFromTrigger,
    openWithKeyboard,
    handleControlKeyDown,
    focusInputField,
    focusPillButton,
    handleTriggerClick,
    handleTriggerPointerUp,
  };
}

export type SelectNavigation = ReturnType<typeof useSelectNavigation>;
