"use client";

import clsx from "clsx";
import {
  forwardRef,
  type KeyboardEvent,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import styles from "./DatePicker.module.scss";
import Text from "../Text/Text";

type SingleSegment = "year" | "month" | "day";
type RangeSegment =
  | "startYear"
  | "startMonth"
  | "startDay"
  | "endYear"
  | "endMonth"
  | "endDay";
type Segment = SingleSegment | RangeSegment;

function padYear(n: number | null): string {
  if (n === null) return "";
  return String(n);
}

function padMonthDay(n: number | null): string {
  if (n === null) return "";
  return String(n);
}

function getWidth(val: string, placeholder: string): string {
  return `${(val || placeholder).length + 0.8}ch`;
}

export interface DatePickerCoreRef {
  focusFirst: () => void;
  focusLast: () => void;
}

export interface DatePickerCoreProps {
  mode: "single" | "range";
  year: number | null;
  month: number | null;
  day: number | null;
  startYear: number | null;
  startMonth: number | null;
  startDay: number | null;
  endYear: number | null;
  endMonth: number | null;
  endDay: number | null;
  today: Date;
  disabled?: boolean;
  readOnly?: boolean;
  onDateChange: (seg: Segment, val: number | null) => void;
  onFocusPrev?: () => void;
  onFocusNext?: () => void;
}

const DatePickerCore = forwardRef<DatePickerCoreRef, DatePickerCoreProps>(
  (
    {
      mode,
      year,
      month,
      day,
      startYear,
      startMonth,
      startDay,
      endYear,
      endMonth,
      endDay,
      today,
      disabled,
      readOnly,
      onDateChange,
      onFocusPrev,
      onFocusNext,
    },
    ref,
  ) => {
    const bufRef = useRef("");

    const yearRef = useRef<HTMLInputElement>(null);
    const monthRef = useRef<HTMLInputElement>(null);
    const dayRef = useRef<HTMLInputElement>(null);
    const startYearRef = useRef<HTMLInputElement>(null);
    const startMonthRef = useRef<HTMLInputElement>(null);
    const startDayRef = useRef<HTMLInputElement>(null);
    const endYearRef = useRef<HTMLInputElement>(null);
    const endMonthRef = useRef<HTMLInputElement>(null);
    const endDayRef = useRef<HTMLInputElement>(null);

    const getSegmentRef = useCallback((seg: Segment) => {
      switch (seg) {
        case "year":
          return yearRef;
        case "month":
          return monthRef;
        case "day":
          return dayRef;
        case "startYear":
          return startYearRef;
        case "startMonth":
          return startMonthRef;
        case "startDay":
          return startDayRef;
        case "endYear":
          return endYearRef;
        case "endMonth":
          return endMonthRef;
        case "endDay":
          return endDayRef;
      }
    }, []);

    const order = useMemo<Segment[]>(() => {
      return mode === "single"
        ? ["year", "month", "day"]
        : [
            "startYear",
            "startMonth",
            "startDay",
            "endYear",
            "endMonth",
            "endDay",
          ];
    }, [mode]);

    useImperativeHandle(ref, () => ({
      focusFirst: () => getSegmentRef(order[0]).current?.focus(),
      focusLast: () => getSegmentRef(order[order.length - 1]).current?.focus(),
    }));

    const moveNext = useCallback(
      (current: Segment) => {
        const idx = order.indexOf(current);
        if (idx < order.length - 1)
          getSegmentRef(order[idx + 1]).current?.focus();
        else onFocusNext?.();
      },
      [getSegmentRef, order, onFocusNext],
    );

    const movePrev = useCallback(
      (current: Segment) => {
        const idx = order.indexOf(current);
        if (idx > 0) getSegmentRef(order[idx - 1]).current?.focus();
        else onFocusPrev?.();
      },
      [getSegmentRef, order, onFocusPrev],
    );

    const focusAndSelect = useCallback(
      (segment: Segment) => {
        const target = getSegmentRef(segment).current;
        if (!target) return;
        requestAnimationFrame(() => {
          target.focus();
          if ("select" in target && typeof target.select === "function")
            target.select();
        });
      },
      [getSegmentRef],
    );

    const commitSegment = useCallback(
      (seg: Segment, rawValue: string) => {
        const isYear = seg.toLowerCase().includes("year");
        const isMonth = seg.toLowerCase().includes("month");
        const isDay = seg.toLowerCase().includes("day");

        const maxLen = isYear ? 4 : 2;
        const digits = rawValue.replace(/\D/g, "").slice(-maxLen);

        let max = 9999;
        let min = 1000;
        if (isMonth) {
          max = 12;
          min = 1;
        } else if (isDay) {
          let y = today.getFullYear();
          let m = today.getMonth() + 1;
          if (seg === "day") {
            y = year ?? y;
            m = month ?? m;
          } else if (seg === "startDay") {
            y = startYear ?? y;
            m = startMonth ?? m;
          } else if (seg === "endDay") {
            y = endYear ?? y;
            m = endMonth ?? m;
          }
          max = new Date(y, m, 0).getDate();
          min = 1;
        }

        if (!digits) {
          onDateChange(seg, null);
          return;
        }

        const parsed = Number(digits);
        let next = parsed;
        if (isYear) {
          if (digits.length === 4)
            next = Math.max(1000, Math.min(9999, parsed));
        } else {
          next = Math.max(min, Math.min(max, parsed));
        }

        onDateChange(seg, next);

        if (digits.length >= maxLen || (!isYear && parsed * 10 > max)) {
          moveNext(seg);
        }
      },
      [
        year,
        month,
        startYear,
        startMonth,
        endYear,
        endMonth,
        today,
        onDateChange,
        moveNext,
      ],
    );

    const handleBlur = (seg: Segment) => {
      if (bufRef.current) {
        const val = bufRef.current;
        bufRef.current = "";
        commitSegment(seg, val);
      }
    };

    const handleKeyDown = (
      e: KeyboardEvent<HTMLInputElement>,
      seg: Segment,
    ) => {
      if (e.key === "Tab") return;

      const isYear = seg.toLowerCase().includes("year");
      const isMonth = seg.toLowerCase().includes("month");
      const isDay = seg.toLowerCase().includes("day");

      let max = 9999;
      let min = 1000;
      if (isMonth) {
        max = 12;
        min = 1;
      } else if (isDay) {
        let y = today.getFullYear(),
          m = today.getMonth() + 1;
        if (seg === "day") {
          y = year ?? y;
          m = month ?? m;
        } else if (seg === "startDay") {
          y = startYear ?? y;
          m = startMonth ?? m;
        } else if (seg === "endDay") {
          y = endYear ?? y;
          m = endMonth ?? m;
        }
        max = new Date(y, m, 0).getDate();
        min = 1;
      }

      const current = (() => {
        switch (seg) {
          case "year":
            return year;
          case "month":
            return month;
          case "day":
            return day;
          case "startYear":
            return startYear;
          case "startMonth":
            return startMonth;
          case "startDay":
            return startDay;
          case "endYear":
            return endYear;
          case "endMonth":
            return endMonth;
          case "endDay":
            return endDay;
        }
      })();
      const base = current ?? (isYear ? today.getFullYear() : min);

      if (e.key === "ArrowUp") {
        e.preventDefault();
        onDateChange(seg, base + 1 > max ? min : base + 1);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        onDateChange(seg, base - 1 < min ? max : base - 1);
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        moveNext(seg);
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        movePrev(seg);
        return;
      }

      if (e.key === "Backspace") {
        if (!e.currentTarget.value) {
          e.preventDefault();
          movePrev(seg);
        }
        return;
      }

      if (!/^\d$/.test(e.key)) return;

      e.preventDefault();
      bufRef.current += e.key;
      const attempt = Number(bufRef.current);
      const maxLen = isYear ? 4 : 2;

      if (bufRef.current.length >= maxLen || (!isYear && attempt * 10 > max)) {
        const val = bufRef.current;
        bufRef.current = "";
        commitSegment(seg, val);
        return;
      }

      onDateChange(seg, attempt);
    };

    const isDisabledOrReadOnly = !!(disabled || readOnly);

    if (mode === "single") {
      return (
        <>
          <input
            ref={yearRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={4}
            placeholder="YYYY"
            className={clsx(styles.Field, styles.FieldYear, "Subheadline")}
            style={{ width: getWidth(padYear(year), "YYYY") }}
            value={padYear(year)}
            readOnly={isDisabledOrReadOnly}
            disabled={isDisabledOrReadOnly}
            onFocus={() => {
              bufRef.current = "";
              focusAndSelect("year");
            }}
            onClick={() => focusAndSelect("year")}
            onChange={(e) => commitSegment("year", e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "year")}
            onBlur={() => handleBlur("year")}
          />
          <Text type="Subheadline" verticalTrim className={styles.Sep}>
            .
          </Text>
          <input
            ref={monthRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={2}
            placeholder="MM"
            className={clsx(styles.Field, styles.FieldMonth, "Subheadline")}
            style={{ width: getWidth(padMonthDay(month), "MM") }}
            value={padMonthDay(month)}
            readOnly={isDisabledOrReadOnly}
            disabled={isDisabledOrReadOnly}
            onFocus={() => {
              bufRef.current = "";
              focusAndSelect("month");
            }}
            onClick={() => focusAndSelect("month")}
            onChange={(e) => commitSegment("month", e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "month")}
            onBlur={() => handleBlur("month")}
          />
          <Text type="Subheadline" verticalTrim className={styles.Sep}>
            .
          </Text>
          <input
            ref={dayRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            maxLength={2}
            placeholder="DD"
            className={clsx(styles.Field, styles.FieldDay, "Subheadline")}
            style={{ width: getWidth(padMonthDay(day), "DD") }}
            value={padMonthDay(day)}
            readOnly={isDisabledOrReadOnly}
            disabled={isDisabledOrReadOnly}
            onFocus={() => {
              bufRef.current = "";
              focusAndSelect("day");
            }}
            onClick={() => focusAndSelect("day")}
            onChange={(e) => commitSegment("day", e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "day")}
            onBlur={() => handleBlur("day")}
          />
        </>
      );
    }

    return (
      <>
        <input
          ref={startYearRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          maxLength={4}
          placeholder="YYYY"
          className={clsx(styles.Field, styles.FieldYear, "Subheadline")}
          style={{ width: getWidth(padYear(startYear), "YYYY") }}
          value={padYear(startYear)}
          readOnly={isDisabledOrReadOnly}
          disabled={isDisabledOrReadOnly}
          onFocus={() => {
            bufRef.current = "";
            focusAndSelect("startYear");
          }}
          onClick={() => focusAndSelect("startYear")}
          onChange={(e) => commitSegment("startYear", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "startYear")}
          onBlur={() => handleBlur("startYear")}
        />
        <Text type="Subheadline" verticalTrim className={styles.Sep}>
          .
        </Text>
        <input
          ref={startMonthRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          maxLength={2}
          placeholder="MM"
          className={clsx(styles.Field, styles.FieldMonth, "Subheadline")}
          style={{ width: getWidth(padMonthDay(startMonth), "MM") }}
          value={padMonthDay(startMonth)}
          readOnly={isDisabledOrReadOnly}
          disabled={isDisabledOrReadOnly}
          onFocus={() => {
            bufRef.current = "";
            focusAndSelect("startMonth");
          }}
          onClick={() => focusAndSelect("startMonth")}
          onChange={(e) => commitSegment("startMonth", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "startMonth")}
          onBlur={() => handleBlur("startMonth")}
        />
        <Text type="Subheadline" verticalTrim className={styles.Sep}>
          .
        </Text>
        <input
          ref={startDayRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          maxLength={2}
          placeholder="DD"
          className={clsx(styles.Field, styles.FieldDay, "Subheadline")}
          style={{ width: getWidth(padMonthDay(startDay), "DD") }}
          value={padMonthDay(startDay)}
          readOnly={isDisabledOrReadOnly}
          disabled={isDisabledOrReadOnly}
          onFocus={() => {
            bufRef.current = "";
            focusAndSelect("startDay");
          }}
          onClick={() => focusAndSelect("startDay")}
          onChange={(e) => commitSegment("startDay", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "startDay")}
          onBlur={() => handleBlur("startDay")}
        />
        <Text type="Subheadline" verticalTrim className={styles.RangeSep}>
          –
        </Text>
        <input
          ref={endYearRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          maxLength={4}
          placeholder="YYYY"
          className={clsx(styles.Field, styles.FieldYear, "Subheadline")}
          style={{ width: getWidth(padYear(endYear), "YYYY") }}
          value={padYear(endYear)}
          readOnly={isDisabledOrReadOnly}
          disabled={isDisabledOrReadOnly}
          onFocus={() => {
            bufRef.current = "";
            focusAndSelect("endYear");
          }}
          onClick={() => focusAndSelect("endYear")}
          onChange={(e) => commitSegment("endYear", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "endYear")}
          onBlur={() => handleBlur("endYear")}
        />
        <Text type="Subheadline" verticalTrim className={styles.Sep}>
          .
        </Text>
        <input
          ref={endMonthRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          maxLength={2}
          placeholder="MM"
          className={clsx(styles.Field, styles.FieldMonth, "Subheadline")}
          style={{ width: getWidth(padMonthDay(endMonth), "MM") }}
          value={padMonthDay(endMonth)}
          readOnly={isDisabledOrReadOnly}
          disabled={isDisabledOrReadOnly}
          onFocus={() => {
            bufRef.current = "";
            focusAndSelect("endMonth");
          }}
          onClick={() => focusAndSelect("endMonth")}
          onChange={(e) => commitSegment("endMonth", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "endMonth")}
          onBlur={() => handleBlur("endMonth")}
        />
        <Text type="Subheadline" verticalTrim className={styles.Sep}>
          .
        </Text>
        <input
          ref={endDayRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          maxLength={2}
          placeholder="DD"
          className={clsx(styles.Field, styles.FieldDay, "Subheadline")}
          style={{ width: getWidth(padMonthDay(endDay), "DD") }}
          value={padMonthDay(endDay)}
          readOnly={isDisabledOrReadOnly}
          disabled={isDisabledOrReadOnly}
          onFocus={() => {
            bufRef.current = "";
            focusAndSelect("endDay");
          }}
          onClick={() => focusAndSelect("endDay")}
          onChange={(e) => commitSegment("endDay", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "endDay")}
          onBlur={() => handleBlur("endDay")}
        />
      </>
    );
  },
);

export default DatePickerCore;
