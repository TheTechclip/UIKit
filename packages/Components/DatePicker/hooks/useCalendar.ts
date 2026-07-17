"use client";
import { useCallback, useMemo, useState } from "react";
import { getCalendarDays } from "@/packages/Components/DatePicker/DatePicker.utils";

interface UseCalendarOptions {
  initialYear: number;
  initialMonth: number;
}

interface UseCalendarReturn {
  viewYear: number;
  viewMonth: number;
  setViewYear: React.Dispatch<React.SetStateAction<number>>;
  setViewMonth: React.Dispatch<React.SetStateAction<number>>;
  prevMonth: () => void;
  nextMonth: () => void;
  days: Date[];
}

export function useCalendar({
  initialYear,
  initialMonth,
}: UseCalendarOptions): UseCalendarReturn {
  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);

  const prevMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }, []);

  const days = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  return {
    viewYear,
    viewMonth,
    setViewYear,
    setViewMonth,
    prevMonth,
    nextMonth,
    days,
  };
}
