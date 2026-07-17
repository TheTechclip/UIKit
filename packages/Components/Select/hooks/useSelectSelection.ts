"use client";
import { useCallback } from "react";
import type { SelectState } from "@/packages/Components/Select/hooks/useSelectState";
import type {
  Option,
  SelectChangeEvent,
  SelectValue,
} from "@/packages/Components/Select/Select.types";
import { filterOptionsByQuery } from "@/packages/Components/Select/Select.utils";

export function useSelectSelection(state: SelectState) {
  const {
    props,
    isMultiple,
    isInteractionDisabled,
    isTypeableControl,
    selectedValues,
    flatOptions,
    suppressOpenUntilRef,
    setSelectedValues,
    setInputValue,
    setQuery,
    setOpen,
    setActiveIndex,
    isOptionSelectionDisabled,
    getFirstSelectableIndex,
  } = state;

  const emitNativeChange = useCallback(
    (next: SelectValue<boolean>) => {
      props.onChange?.({
        target: { value: next },
      } as SelectChangeEvent<boolean>);
    },
    [props.onChange],
  );

  const clearSelection = useCallback(() => {
    if (isInteractionDisabled) return;
    setInputValue("");
    setQuery("");
    setSelectedValues([]);
    emitNativeChange((isMultiple ? [] : "") as SelectValue<boolean>);
    props.onInputChange?.("");
    setActiveIndex(-1);
  }, [
    emitNativeChange,
    isInteractionDisabled,
    isMultiple,
    props.onInputChange,
    setInputValue,
    setQuery,
    setSelectedValues,
    setActiveIndex,
  ]);

  const removeSelectedOption = useCallback(
    (optionValue: string) => {
      const nextValues = selectedValues.filter((item) => item !== optionValue);
      setSelectedValues(nextValues);
      emitNativeChange(nextValues);
      props.onInputChange?.("");
      setOpen(true);
      setActiveIndex(
        getFirstSelectableIndex(
          filterOptionsByQuery(flatOptions, ""),
          nextValues,
        ),
      );
    },
    [
      emitNativeChange,
      flatOptions,
      getFirstSelectableIndex,
      props.onInputChange,
      selectedValues,
      setSelectedValues,
      setOpen,
      setActiveIndex,
    ],
  );

  const selectOption = useCallback(
    (option: Option) => {
      if (isInteractionDisabled || isOptionSelectionDisabled(option)) return;
      const next = String(option.value);
      if (isMultiple) {
        const isSelected = selectedValues.includes(next);
        const nextValues = isSelected
          ? selectedValues.filter((item) => item !== next)
          : [...selectedValues, next];
        setSelectedValues(nextValues);
        emitNativeChange(nextValues);
        if (isTypeableControl) {
          props.onInputChange?.("");
        }
        setQuery("");
        setOpen(true);
        setActiveIndex(
          getFirstSelectableIndex(
            filterOptionsByQuery(flatOptions, ""),
            nextValues,
          ),
        );
        return;
      }
      setSelectedValues([next]);
      setInputValue(option.label);
      setQuery("");
      emitNativeChange(next);
      suppressOpenUntilRef.current = Date.now() + 280;
      setOpen(false);
      setActiveIndex(-1);
    },
    [
      emitNativeChange,
      flatOptions,
      getFirstSelectableIndex,
      isMultiple,
      isTypeableControl,
      isOptionSelectionDisabled,
      props.onInputChange,
      selectedValues,
      setSelectedValues,
      setInputValue,
      setQuery,
      suppressOpenUntilRef,
      setOpen,
      setActiveIndex,
      isInteractionDisabled,
    ],
  );

  return {
    selectOption,
    removeSelectedOption,
    clearSelection,
    emitNativeChange,
  };
}

type SelectSelection = ReturnType<typeof useSelectSelection>;
