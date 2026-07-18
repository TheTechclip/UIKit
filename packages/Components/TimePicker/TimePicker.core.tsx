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
import Pressable from "../../Frameworks/Pressable/Pressable";
import View from "../../Frameworks/View/View";
import Text from "../Text/Text";
import styles from "./TimePicker.module.scss";

type Segment = "hour" | "minute" | "second" | "ampm";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export interface TimePickerCoreRef {
  focusFirst: () => void;
  focusLast: () => void;
}

export interface TimePickerCoreProps {
  hour: number | null;
  minute: number | null;
  second: number | null;
  ampm: "AM" | "PM";
  use12h?: boolean;
  showSeconds?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onTimeChange: (
    hour: number | null,
    minute: number | null,
    second: number | null,
    ampm: "AM" | "PM",
  ) => void;
  onHourOverflow?: (info: { input: number; normalized: number }) => void;
  onFocusPrev?: () => void;
  onFocusNext?: () => void;
}

const TimePickerCore = forwardRef<TimePickerCoreRef, TimePickerCoreProps>(
  (
    {
      hour,
      minute,
      second,
      ampm,
      use12h = false,
      showSeconds = false,
      disabled,
      readOnly,
      onTimeChange,
      onHourOverflow,
      onFocusPrev,
      onFocusNext,
    },
    ref,
  ) => {
    const bufRef = useRef("");
    const hourRef = useRef<HTMLInputElement>(null);
    const minuteRef = useRef<HTMLInputElement>(null);
    const secondRef = useRef<HTMLInputElement>(null);
    const ampmRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => ({
      focusFirst: () => hourRef.current?.focus(),
      focusLast: () => {
        if (use12h) ampmRef.current?.focus();
        else if (showSeconds) secondRef.current?.focus();
        else minuteRef.current?.focus();
      },
    }));

    const order = useMemo<Segment[]>(() => {
      const list: Segment[] = ["hour", "minute"];
      if (showSeconds) list.push("second");
      if (use12h) list.push("ampm");
      return list;
    }, [showSeconds, use12h]);

    const getSegmentRef = useCallback((segment: Segment) => {
      switch (segment) {
        case "hour":
          return hourRef;
        case "minute":
          return minuteRef;
        case "second":
          return secondRef;
        case "ampm":
          return ampmRef;
      }
    }, []);

    const moveNext = useCallback(
      (current: Segment) => {
        const next = order[order.indexOf(current) + 1];
        if (next) getSegmentRef(next).current?.focus();
        else onFocusNext?.();
      },
      [getSegmentRef, order, onFocusNext],
    );

    const movePrev = useCallback(
      (current: Segment) => {
        const prev = order[order.indexOf(current) - 1];
        if (prev) getSegmentRef(prev).current?.focus();
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

    const displayHour =
      hour !== null
        ? use12h
          ? pad(hour % 12 === 0 ? 12 : hour % 12)
          : pad(hour)
        : "";
    const displayMinute = minute !== null ? pad(minute) : "";
    const displaySecond = second !== null ? pad(second) : "";

    const normalizeHourInput = useCallback(
      (rawValue: number) =>
        use12h || rawValue < 24 ? rawValue : rawValue % 24,
      [use12h],
    );

    const commitNumericSegment = useCallback(
      (segment: "hour" | "minute" | "second", rawValue: string) => {
        const digits = rawValue.replace(/\D/g, "").slice(-2);
        const max = segment === "hour" ? (use12h ? 12 : 23) : 59;
        const min = segment === "hour" && use12h ? 1 : 0;

        let nextH = hour,
          nextM = minute,
          nextS = second;

        if (!digits) {
          const minVal = min;
          if (segment === "hour") nextH = minVal;
          if (segment === "minute") nextM = minVal;
          if (segment === "second") nextS = minVal;
          onTimeChange(nextH, nextM, nextS, ampm);
          return;
        }

        const parsed = Number(digits);
        const shouldNormalizeHour =
          segment === "hour" && !use12h && parsed >= 24;
        const next = shouldNormalizeHour
          ? normalizeHourInput(parsed)
          : Math.max(min, Math.min(max, parsed));

        if (shouldNormalizeHour)
          onHourOverflow?.({ input: parsed, normalized: next });

        if (segment === "hour") nextH = next;
        if (segment === "minute") nextM = next;
        if (segment === "second") nextS = next;
        onTimeChange(nextH, nextM, nextS, ampm);

        if (digits.length >= 2 || parsed * 10 > max) moveNext(segment);
      },
      [
        hour,
        minute,
        second,
        ampm,
        use12h,
        moveNext,
        normalizeHourInput,
        onHourOverflow,
        onTimeChange,
      ],
    );

    const handleBlur = (seg: "hour" | "minute" | "second") => {
      if (bufRef.current) {
        const val = bufRef.current;
        bufRef.current = "";
        commitNumericSegment(seg, val);
      }
    };

    const updateAmpm = useCallback(
      (next: "AM" | "PM") => {
        onTimeChange(hour, minute, second, next);
      },
      [hour, minute, second, onTimeChange],
    );

    const handleNumericKeyDown = (
      e: KeyboardEvent<HTMLInputElement>,
      segment: "hour" | "minute" | "second",
    ) => {
      const max = segment === "hour" ? (use12h ? 12 : 23) : 59;
      const min = segment === "hour" && use12h ? 1 : 0;

      let displayHourVal = hour;
      if (use12h && hour !== null) {
        displayHourVal = hour % 12 === 0 ? 12 : hour % 12;
      }
      const current =
        segment === "hour"
          ? displayHourVal
          : segment === "minute"
            ? minute
            : second;
      const base = current ?? min;

      if (e.key === "Tab") return;

      if (e.key === "Backspace") {
        if (!e.currentTarget.value) {
          e.preventDefault();
          movePrev(segment);
        }
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = base + 1 > max ? min : base + 1;
        let nextH = hour,
          nextM = minute,
          nextS = second;
        if (segment === "hour") nextH = next;
        if (segment === "minute") nextM = next;
        if (segment === "second") nextS = next;
        onTimeChange(nextH, nextM, nextS, ampm);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = base - 1 < min ? max : base - 1;
        let nextH = hour,
          nextM = minute,
          nextS = second;
        if (segment === "hour") nextH = next;
        if (segment === "minute") nextM = next;
        if (segment === "second") nextS = next;
        onTimeChange(nextH, nextM, nextS, ampm);
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        moveNext(segment);
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        movePrev(segment);
        return;
      }

      if (!/^\d$/.test(e.key)) return;

      e.preventDefault();
      bufRef.current += e.key;
      const attempt = Number(bufRef.current);

      if (bufRef.current.length >= 2 || attempt * 10 > max) {
        const val = bufRef.current;
        bufRef.current = "";
        commitNumericSegment(segment, val);
        return;
      }

      let nextH = hour,
        nextM = minute,
        nextS = second;
      if (segment === "hour") nextH = attempt;
      if (segment === "minute") nextM = attempt;
      if (segment === "second") nextS = attempt;
      onTimeChange(nextH, nextM, nextS, ampm);
    };

    const handleAmpmKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Tab") return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        movePrev("ampm");
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        moveNext("ampm");
        return;
      }

      if (
        e.key === "Enter" ||
        e.key === " " ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        updateAmpm(ampm === "AM" ? "PM" : "AM");
        return;
      }

      if (e.key.toLowerCase() === "a" || e.key.toLowerCase() === "p") {
        e.preventDefault();
        updateAmpm(e.key.toLowerCase() === "a" ? "AM" : "PM");
      }
    };

    const isDisabledOrReadOnly = !!(disabled || readOnly);

    return (
      <>
        <input
          ref={hourRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          maxLength={2}
          placeholder="--"
          className={clsx(styles.Field, "Subheadline")}
          value={displayHour}
          readOnly={isDisabledOrReadOnly}
          disabled={isDisabledOrReadOnly}
          onFocus={() => {
            bufRef.current = "";
            focusAndSelect("hour");
          }}
          onClick={() => focusAndSelect("hour")}
          onChange={(e) => commitNumericSegment("hour", e.target.value)}
          onKeyDown={(e) => handleNumericKeyDown(e, "hour")}
          onBlur={() => handleBlur("hour")}
        />

        <Text type="Subheadline" verticalTrim className={styles.Sep}>
          :
        </Text>

        <input
          ref={minuteRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          maxLength={2}
          placeholder="--"
          className={clsx(styles.Field, "Subheadline")}
          value={displayMinute}
          readOnly={isDisabledOrReadOnly}
          disabled={isDisabledOrReadOnly}
          onFocus={() => {
            bufRef.current = "";
            focusAndSelect("minute");
          }}
          onClick={() => focusAndSelect("minute")}
          onChange={(e) => commitNumericSegment("minute", e.target.value)}
          onKeyDown={(e) => handleNumericKeyDown(e, "minute")}
          onBlur={() => handleBlur("minute")}
        />

        {showSeconds && (
          <>
            <Text type="Subheadline" verticalTrim className={styles.Sep}>
              :
            </Text>
            <input
              ref={secondRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              maxLength={2}
              placeholder="--"
              className={clsx(styles.Field, "Subheadline")}
              value={displaySecond}
              readOnly={isDisabledOrReadOnly}
              disabled={isDisabledOrReadOnly}
              onFocus={() => {
                bufRef.current = "";
                focusAndSelect("second");
              }}
              onClick={() => focusAndSelect("second")}
              onChange={(e) => commitNumericSegment("second", e.target.value)}
              onKeyDown={(e) => handleNumericKeyDown(e, "second")}
              onBlur={() => handleBlur("second")}
            />
          </>
        )}

        {use12h && (
          <>
            <Text type="Subheadline" verticalTrim className={styles.Sep}>
              &nbsp;
            </Text>
            <View className={styles.AmpmWrap}>
              <Pressable
                ref={ampmRef}
                className={clsx(
                  styles.Field,
                  styles.FieldAmpm,
                  styles.FieldButton,
                )}
                disabled={isDisabledOrReadOnly}
                onFocus={() => {
                  bufRef.current = "";
                }}
                onClick={() => {
                  if (isDisabledOrReadOnly) return;
                  updateAmpm(ampm === "AM" ? "PM" : "AM");
                }}
                onKeyDown={handleAmpmKeyDown}
              >
                <Text type="Subheadline" verticalTrim>
                  {ampm}
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </>
    );
  },
);

export default TimePickerCore;
