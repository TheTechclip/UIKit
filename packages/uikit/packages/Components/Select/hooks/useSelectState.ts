"use client";
import { useViewportMatch } from "@musecat/functionkit";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { Word } from "../../../../i18n/shared";
import type {
  Option,
  SelectProps,
} from "../Select.types";
import {
  filterOptionsByQuery,
  findScrollableAncestor,
  getStringValues,
  isOptGroup,
} from "../Select.utils";

export function useSelectState(props: SelectProps<boolean>) {
  const t = Word();
  const {
    value,
    defaultValue,
    options,
    multiple = false,
    combobox = false,
    disabled = false,
    readOnly = false,
    lockAncestorScrollOnOpen = false,
    placeholder,
  } = props;
  const isMultiple = multiple;
  const isInlineCombobox = combobox === true || combobox === "inline";
  const isPopoverSearch = combobox === "search";
  const isMobileSheet = useViewportMatch("(max-width: 549.98px)");

  const isInlineComboboxActive = isInlineCombobox && !isMobileSheet;
  const isPopoverSearchActive =
    isPopoverSearch || (isInlineCombobox && isMobileSheet);
  const isTypeableControl = isInlineComboboxActive;
  const isInteractionDisabled = disabled || readOnly;

  const groupedOptions = useMemo(
    () =>
      (options ?? []).map((item) =>
        isOptGroup(item) ? item : { label: undefined, options: [item] },
      ),
    [options],
  );
  const flatOptions = useMemo(
    () => groupedOptions.flatMap((g) => g.options),
    [groupedOptions],
  );
  const initialValues = getStringValues(value, defaultValue);
  const instanceId = useId();
  const selectId = props.id ?? `${instanceId}-control`;
  const listId = `${instanceId}-listbox`;
  const popoverOwnerId = `${instanceId}-popover`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>(initialValues);
  const [openSource, setOpenSource] = useState<"mouse" | "keyboard">("mouse");

  const selectedValue = selectedValues[0] ?? "";
  const selectedOptionLabel = useMemo(() => {
    const selectedOption = flatOptions.find(
      (option) => String(option.value) === selectedValue,
    );
    return selectedOption?.label ?? "";
  }, [flatOptions, selectedValue]);
  const selectedOptions = useMemo(
    () =>
      selectedValues
        .map((value) => flatOptions.find((o) => String(o.value) === value))
        .filter((option): option is Option => option !== undefined),
    [flatOptions, selectedValues],
  );

  const rootRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const suppressOpenUntilRef = useRef(0);
  const suppressClickUntilRef = useRef(0);
  const ensureVisibleRafRef = useRef<number | null>(null);
  const pointerDownInsidePopoverRef = useRef(false);
  const lastClosedByTabRef = useRef(false);
  const popoverInputRef = useRef<HTMLInputElement>(null);
  const isFirstRenderRef = useRef(true);

  const ensureControlVisible = useCallback(() => {
    const controlEl = controlRef.current;
    if (!controlEl) return;
    const scrollAncestor = findScrollableAncestor(controlEl);
    controlEl.scrollIntoView({ block: "nearest", inline: "nearest" });
    void scrollAncestor;
  }, []);
  const scheduleEnsureControlVisible = useCallback(() => {
    if (ensureVisibleRafRef.current !== null) {
      cancelAnimationFrame(ensureVisibleRafRef.current);
    }
    const outerRafId = requestAnimationFrame(() => {
      ensureVisibleRafRef.current = requestAnimationFrame(() => {
        ensureControlVisible();
        ensureVisibleRafRef.current = null;
      });
    });
    ensureVisibleRafRef.current = outerRafId;
  }, [ensureControlVisible]);

  useEffect(() => {
    return () => {
      if (ensureVisibleRafRef.current !== null) {
        cancelAnimationFrame(ensureVisibleRafRef.current);
      }
    };
  }, []);
  useEffect(() => {
    if (value === undefined) return;
    const nextValues = getStringValues(value);
    setSelectedValues(nextValues);
  }, [value]);
  useEffect(() => {
    if (isMultiple) return;
    if (open && query) return;

    const nextSelectedValue = selectedValues[0] ?? "";
    const nextSelectedOption = flatOptions.find(
      (option) => String(option.value) === nextSelectedValue,
    );
    if (!nextSelectedOption && isInlineComboboxActive && query) {
      setInputValue(query);
      return;
    }
    setInputValue(nextSelectedOption?.label ?? "");
  }, [
    flatOptions,
    isMultiple,
    isInlineComboboxActive,
    open,
    query,
    selectedValues,
  ]);

  const isInOwnPopover = useCallback(
    (target: EventTarget | null) => {
      const element = target as HTMLElement | null;
      if (!element) return false;
      return !!element.closest(`[data-popover-owner="${popoverOwnerId}"]`);
    },
    [popoverOwnerId],
  );

  const visibleOptions = useMemo(
    () =>
      !isTypeableControl && !isPopoverSearchActive
        ? flatOptions
        : filterOptionsByQuery(flatOptions, query),
    [flatOptions, isTypeableControl, isPopoverSearchActive, query],
  );
  const visibleIndexMap = useMemo(() => {
    const map = new Map<Option, number>();
    visibleOptions.forEach((option, index) => {
      map.set(option, index);
    });
    return map;
  }, [visibleOptions]);
  const visibleGroupedOptions = useMemo(() => {
    return groupedOptions
      .map((group) => ({
        label: group.label,
        options: group.options.filter((option) => visibleIndexMap.has(option)),
      }))
      .filter((group) => group.options.length > 0);
  }, [groupedOptions, visibleIndexMap]);

  useEffect(() => {
    setActiveIndex((prev) => {
      if (!visibleOptions.length) return -1;
      if (prev < 0) return prev;
      return Math.min(prev, visibleOptions.length - 1);
    });
  }, [visibleOptions.length]);

  const isOptionSelectionDisabled = useCallback(
    (option: Option) =>
      !!option.disabled ||
      (!isMultiple &&
        (isTypeableControl || isPopoverSearchActive) &&
        selectedValues.includes(String(option.value))),
    [isMultiple, isTypeableControl, isPopoverSearchActive, selectedValues],
  );

  const getFirstSelectableIndex = useCallback(
    (items: Option[], blockedValues: string[] = selectedValues) =>
      items.findIndex(
        (item) =>
          !item.disabled &&
          (!(isTypeableControl || isPopoverSearchActive) ||
            !blockedValues.includes(String(item.value))),
      ),
    [isTypeableControl, isPopoverSearchActive, selectedValues],
  );
  const getFirstEnabledIndex = useCallback(
    (items: Option[]) => getFirstSelectableIndex(items),
    [getFirstSelectableIndex],
  );
  const getNextEnabledIndex = useCallback(
    (items: Option[], start: number, direction: 1 | -1) => {
      if (!items.length) return -1;
      let idx = start;
      for (let i = 0; i < items.length; i += 1) {
        idx += direction;
        if (idx < 0) idx = items.length - 1;
        if (idx >= items.length) idx = 0;
        if (items[idx] && !isOptionSelectionDisabled(items[idx])) return idx;
      }
      return -1;
    },
    [isOptionSelectionDisabled],
  );
  const getSelectedEnabledIndex = useCallback(
    (items: Option[]) =>
      items.findIndex(
        (item) =>
          selectedValues.includes(String(item.value)) &&
          !isOptionSelectionDisabled(item),
      ),
    [isOptionSelectionDisabled, selectedValues],
  );
  const getInitialActiveIndex = useCallback(
    (items: Option[]) => {
      const selectedIdx = getSelectedEnabledIndex(items);
      return selectedIdx >= 0 ? selectedIdx : getFirstEnabledIndex(items);
    },
    [getFirstEnabledIndex, getSelectedEnabledIndex],
  );

  const selectedLabel = useMemo(() => {
    const picked = flatOptions.find((o) => String(o.value) === selectedValue);
    return picked?.label ?? placeholder ?? t.UIKit.ui.select;
  }, [flatOptions, placeholder, selectedValue, t]);

  return {
    t,
    props,

    isMultiple,
    isInlineCombobox,
    isPopoverSearch,
    isInlineComboboxActive,
    isPopoverSearchActive,
    isTypeableControl,
    isInteractionDisabled,
    lockAncestorScrollOnOpen,
    isMobileSheet,

    instanceId,
    selectId,
    listId,
    popoverOwnerId,

    open,
    setOpen,
    activeIndex,
    setActiveIndex,
    inputValue,
    setInputValue,
    query,
    setQuery,
    selectedValues,
    setSelectedValues,
    openSource,
    setOpenSource,

    rootRef,
    controlRef,
    suppressOpenUntilRef,
    suppressClickUntilRef,
    popoverInputRef,
    pointerDownInsidePopoverRef,
    lastClosedByTabRef,
    isFirstRenderRef,
    ensureVisibleRafRef,

    flatOptions,
    groupedOptions,
    visibleOptions,
    visibleIndexMap,
    visibleGroupedOptions,
    selectedOptions,
    selectedLabel,
    selectedValue,
    selectedOptionLabel,

    isInOwnPopover,
    ensureControlVisible,
    scheduleEnsureControlVisible,

    getFirstEnabledIndex,
    getNextEnabledIndex,
    getSelectedEnabledIndex,
    getFirstSelectableIndex,
    getInitialActiveIndex,
    isOptionSelectionDisabled,
  };
}

export type SelectState = ReturnType<typeof useSelectState>;
