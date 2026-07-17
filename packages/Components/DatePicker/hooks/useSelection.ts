"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { DatePickerMode } from "@/packages/Components/DatePicker/DatePicker.types";
import {
  formatDisplay,
  formatRangeDisplay,
  isBefore,
  isDateDisabled,
  isSameDay,
  parseDate,
  toYMD,
} from "@/packages/Components/DatePicker/DatePicker.utils";

interface UseSelectionOptions {
  mode: DatePickerMode;
  isControlled: boolean;
  value?: string | null;
  defaultValue?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  defaultStartDate?: string | null;
  defaultEndDate?: string | null;
  onChange?: (value: string | null) => void;
  onRangeChange?: (start: string | null, end: string | null) => void;
  onClose?: () => void;
  minDate?: string | null;
  maxDate?: string | null;
  disabledDaysOfWeek?: number[];
  showTime?: boolean;
}

interface UseSelectionReturn {
  selected: Date | null;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  hoverDay: Date | null;
  setHoverDay: React.Dispatch<React.SetStateAction<Date | null>>;
  handleDayClick: (day: Date) => void;
  isInRange: (day: Date) => boolean;
  isRangeStart: (day: Date) => boolean;
  isRangeEnd: (day: Date) => boolean;
  setSelected: React.Dispatch<React.SetStateAction<Date | null>>;
  setRangeStart: React.Dispatch<React.SetStateAction<Date | null>>;
  setRangeEnd: React.Dispatch<React.SetStateAction<Date | null>>;
  displayText: string | null;
}

export function useSelection({
  mode,
  isControlled,
  value,
  defaultValue,
  startDate,
  endDate,
  defaultStartDate,
  defaultEndDate,
  onChange,
  onRangeChange,
  onClose,
  minDate,
  maxDate,
  disabledDaysOfWeek,
  showTime,
}: UseSelectionOptions): UseSelectionReturn {
  const [selected, setSelected] = useState<Date | null>(() =>
    parseDate(value ?? defaultValue),
  );
  const [rangeStart, setRangeStart] = useState<Date | null>(() =>
    parseDate(startDate ?? defaultStartDate),
  );
  const [rangeEnd, setRangeEnd] = useState<Date | null>(() =>
    parseDate(endDate ?? defaultEndDate),
  );
  const [hoverDay, setHoverDay] = useState<Date | null>(null);

  useEffect(() => {
    if (!isControlled) return;
    if (mode === "single") setSelected(parseDate(value));
    else {
      setRangeStart(parseDate(startDate));
      setRangeEnd(parseDate(endDate));
    }
  }, [value, startDate, endDate, mode, isControlled]);

  const handleDayClick = useCallback(
    (day: Date) => {
      if (isDateDisabled(day, minDate, maxDate, disabledDaysOfWeek)) return;
      if (mode === "single") {
        const next = isSameDay(day, selected) ? null : new Date(day);
        if (next && selected) {
          next.setHours(
            selected.getHours(),
            selected.getMinutes(),
            selected.getSeconds(),
            selected.getMilliseconds(),
          );
        }
        if (!isControlled) setSelected(next);
        onChange?.(next ? toYMD(next, showTime) : null);
        onClose?.();
        return;
      }
      if (!rangeStart || (rangeStart && rangeEnd)) {
        const next = new Date(day);
        if (rangeStart) {
          next.setHours(
            rangeStart.getHours(),
            rangeStart.getMinutes(),
            rangeStart.getSeconds(),
            rangeStart.getMilliseconds(),
          );
        }
        if (!isControlled) {
          setRangeStart(next);
          setRangeEnd(null);
        }
        onRangeChange?.(toYMD(next, showTime), null);
      } else {
        let start = new Date(rangeStart);
        let end = new Date(day);
        if (rangeEnd) {
          end.setHours(
            rangeEnd.getHours(),
            rangeEnd.getMinutes(),
            rangeEnd.getSeconds(),
            rangeEnd.getMilliseconds(),
          );
        }
        if (isBefore(end, start)) {
          [start, end] = [end, start];
        }
        if (!isControlled) {
          setRangeStart(start);
          setRangeEnd(end);
        }
        onRangeChange?.(toYMD(start, showTime), toYMD(end, showTime));
        onClose?.();
      }
    },
    [
      mode,
      selected,
      rangeStart,
      rangeEnd,
      isControlled,
      onChange,
      onRangeChange,
      onClose,
      minDate,
      maxDate,
      disabledDaysOfWeek,
      showTime,
    ],
  );

  const isInRange = useCallback(
    (day: Date): boolean => {
      if (mode !== "range") return false;
      const end = rangeEnd ?? hoverDay;
      if (!rangeStart || !end) return false;
      const lo = isBefore(rangeStart, end) ? rangeStart : end;
      const hi = isBefore(rangeStart, end) ? end : rangeStart;
      return day.getTime() > lo.getTime() && day.getTime() < hi.getTime();
    },
    [mode, rangeStart, rangeEnd, hoverDay],
  );

  const isRangeStart = useCallback(
    (day: Date): boolean => {
      const eff = rangeEnd ?? hoverDay;
      if (!rangeStart || !eff) return isSameDay(day, rangeStart);
      const lo = isBefore(rangeStart, eff) ? rangeStart : eff;
      return isSameDay(day, lo);
    },
    [rangeStart, rangeEnd, hoverDay],
  );

  const isRangeEnd = useCallback(
    (day: Date): boolean => {
      const eff = rangeEnd ?? hoverDay;
      if (!rangeStart || !eff) return false;
      const hi = isBefore(rangeStart, eff) ? eff : rangeStart;
      return isSameDay(day, hi);
    },
    [rangeStart, rangeEnd, hoverDay],
  );

  const displayText = useMemo(() => {
    if (mode === "single") return selected ? formatDisplay(selected) : null;
    return rangeStart ? formatRangeDisplay(rangeStart, rangeEnd) : null;
  }, [mode, selected, rangeStart, rangeEnd]);

  return {
    selected,
    rangeStart,
    rangeEnd,
    hoverDay,
    setHoverDay,
    handleDayClick,
    isInRange,
    isRangeStart,
    isRangeEnd,
    setSelected,
    setRangeStart,
    setRangeEnd,
    displayText,
  };
}
