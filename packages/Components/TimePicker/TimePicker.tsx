"use client";

import clsx from "clsx";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Icon from "@/packages/Components/Icon/Icon";
import Label from "@/packages/Components/Label/Label";
import Text from "@/packages/Components/Text/Text";
import styles from "@/packages/Components/TimePicker/TimePicker.module.scss";
import type { TimePickerProps } from "@/packages/Components/TimePicker/TimePicker.types";
import Pressable from "@/packages/Frameworks/Pressable/Pressable";
import View from "@/packages/Frameworks/View/View";

type Segment = "hour" | "minute" | "second" | "ampm";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function parseValue(
  raw: string | undefined,
  use12h: boolean,
): { hour: number; minute: number; second: number; ampm: "AM" | "PM" } {
  const parts = (raw ?? "").split(":");
  const hourPart = Number(parts[0]);
  const minutePart = Number(parts[1]);
  const secondPart = Number(parts[2]);

  let hour = Number.isNaN(hourPart) ? 0 : Math.max(0, Math.min(23, hourPart));
  const minute = Number.isNaN(minutePart)
    ? 0
    : Math.max(0, Math.min(59, minutePart));
  const second = Number.isNaN(secondPart)
    ? 0
    : Math.max(0, Math.min(59, secondPart));
  const ampm: "AM" | "PM" = hour < 12 ? "AM" : "PM";

  if (use12h) {
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
  }

  return { hour, minute, second, ampm };
}

function toTimeString(
  hour: number,
  minute: number,
  second: number,
  ampm: "AM" | "PM",
  use12h: boolean,
  showSeconds: boolean,
): string {
  let normalizedHour = hour;
  if (use12h) {
    normalizedHour =
      ampm === "AM" ? (hour === 12 ? 0 : hour) : hour === 12 ? 12 : hour + 12;
  }

  return showSeconds
    ? `${pad(normalizedHour)}:${pad(minute)}:${pad(second)}`
    : `${pad(normalizedHour)}:${pad(minute)}`;
}

export default function TimePicker({
  title,
  required,
  readOnly,
  disabled,
  hint,
  className,
  style,
  value: valueProp,
  defaultValue,
  showSeconds = false,
  use12h = false,
  onChange,
  onHourOverflow,
  "data-color-mode": dataTheme,
}: TimePickerProps) {
  const isControlled = valueProp !== undefined;
  const hasInitialValue = valueProp !== undefined || defaultValue !== undefined;
  const initial = hasInitialValue
    ? parseValue(valueProp ?? defaultValue, use12h)
    : null;

  const [hour, setHour] = useState<number | null>(
    initial ? initial.hour : null,
  );
  const [minute, setMinute] = useState<number | null>(
    initial ? initial.minute : null,
  );
  const [second, setSecond] = useState<number | null>(
    initial ? initial.second : null,
  );
  const [ampm, setAmpm] = useState<"AM" | "PM">(initial ? initial.ampm : "AM");

  useEffect(() => {
    if (!isControlled || valueProp === undefined) return;

    if (!valueProp) {
      setHour(null);
      setMinute(null);
      setSecond(null);
      return;
    }

    const parsed = parseValue(valueProp, use12h);
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setSecond(parsed.second);
    setAmpm(parsed.ampm);
  }, [valueProp, use12h, isControlled]);

  const emit = useCallback(
    (
      nextHour: number | null,
      nextMinute: number | null,
      nextSecond: number | null,
      nextAmpm: "AM" | "PM",
    ) => {
      if (nextHour === null || nextMinute === null) return;
      if (showSeconds && nextSecond === null) return;
      const secondValue = showSeconds ? (nextSecond as number) : 0;
      onChange?.(
        toTimeString(
          nextHour,
          nextMinute,
          secondValue,
          nextAmpm,
          use12h,
          showSeconds,
        ),
      );
    },
    [onChange, showSeconds, use12h],
  );

  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);
  const ampmRef = useRef<HTMLButtonElement>(null);

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
    },
    [getSegmentRef, order],
  );

  const movePrev = useCallback(
    (current: Segment) => {
      const prev = order[order.indexOf(current) - 1];
      if (prev) getSegmentRef(prev).current?.focus();
    },
    [getSegmentRef, order],
  );

  const focusAndSelect = useCallback(
    (segment: Segment) => {
      const target = getSegmentRef(segment).current;
      if (!target) return;

      requestAnimationFrame(() => {
        target.focus();

        if ("select" in target && typeof target.select === "function") {
          target.select();
        }
      });
    },
    [getSegmentRef],
  );

  const displayHour =
    hour !== null ? (use12h ? pad(hour === 0 ? 12 : hour) : pad(hour)) : "";
  const displayMinute = minute !== null ? pad(minute) : "";
  const displaySecond = second !== null ? pad(second) : "";

  const bufRef = useRef("");

  const getUpdated = useCallback(
    (
      changedSegment: "hour" | "minute" | "second",
      newValue: number,
    ): [number | null, number | null, number | null, "AM" | "PM"] => [
      changedSegment === "hour" ? newValue : hour,
      changedSegment === "minute" ? newValue : minute,
      changedSegment === "second" ? newValue : second,
      ampm,
    ],
    [ampm, hour, minute, second],
  );

  const normalizeHourInput = useCallback(
    (rawValue: number) => (use12h || rawValue < 24 ? rawValue : rawValue % 24),
    [use12h],
  );

  const commitNumericSegment = useCallback(
    (segment: "hour" | "minute" | "second", rawValue: string) => {
      const digits = rawValue.replace(/\D/g, "").slice(-2);
      const max = segment === "hour" ? (use12h ? 12 : 23) : 59;
      const min = segment === "hour" && use12h ? 1 : 0;
      const setter =
        segment === "hour"
          ? setHour
          : segment === "minute"
            ? setMinute
            : setSecond;

      if (!digits) {
        setter(min);
        emit(...getUpdated(segment, min));
        return;
      }

      const parsed = Number(digits);
      const shouldNormalizeHour = segment === "hour" && !use12h && parsed >= 24;
      const next = shouldNormalizeHour
        ? normalizeHourInput(parsed)
        : Math.max(min, Math.min(max, parsed));

      if (shouldNormalizeHour) {
        onHourOverflow?.({
          input: parsed,
          normalized: next,
        });
      }

      setter(next);
      emit(...getUpdated(segment, next));

      if (digits.length >= 2 || parsed * 10 > max) {
        moveNext(segment);
      }
    },
    [emit, getUpdated, moveNext, normalizeHourInput, onHourOverflow, use12h],
  );

  const updateNumericSegment = useCallback(
    (segment: "hour" | "minute" | "second", rawValue: string) => {
      commitNumericSegment(segment, rawValue);
    },
    [commitNumericSegment],
  );

  const handleNumericChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement>,
      segment: "hour" | "minute" | "second",
    ) => {
      updateNumericSegment(segment, e.target.value);
    },
    [updateNumericSegment],
  );

  const updateAmpm = useCallback(
    (next: "AM" | "PM") => {
      setAmpm(next);
      emit(hour, minute, second, next);
    },
    [emit, hour, minute, second],
  );

  const handleNumericKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    segment: "hour" | "minute" | "second",
  ) => {
    const max = segment === "hour" ? (use12h ? 12 : 23) : 59;
    const min = segment === "hour" && use12h ? 1 : 0;
    const current =
      segment === "hour" ? hour : segment === "minute" ? minute : second;
    const base = current ?? min;
    const setter =
      segment === "hour"
        ? setHour
        : segment === "minute"
          ? setMinute
          : setSecond;

    if (e.key === "Tab") return;

    e.preventDefault();

    if (e.key === "ArrowUp") {
      const next = base + 1 > max ? min : base + 1;
      setter(next);
      emit(...getUpdated(segment, next));
      return;
    }

    if (e.key === "ArrowDown") {
      const next = base - 1 < min ? max : base - 1;
      setter(next);
      emit(...getUpdated(segment, next));
      return;
    }

    if (e.key === "ArrowRight") {
      moveNext(segment);
      return;
    }

    if (e.key === "ArrowLeft") {
      movePrev(segment);
      return;
    }

    if (!/^\d$/.test(e.key)) return;

    bufRef.current += e.key;
    const attempt = Number(bufRef.current);

    if (bufRef.current.length >= 2 || attempt * 10 > max) {
      bufRef.current = "";
      commitNumericSegment(segment, String(attempt));
      return;
    }

    setter(attempt);
    emit(...getUpdated(segment, attempt));
  };

  const handleAmpmKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      movePrev("ampm");
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
    <Label
      data-color-mode={dataTheme}
      title={title}
      required={required}
      readOnly={isDisabledOrReadOnly}
      hint={hint}
      className={className}
      style={style}
    >
      <View alignItems="center" gap={2}>
        <Icon icon="iSchedule" size={16} iconFill />

        <View
          alignItems="center"
          gap={2}
          style={{ flex: 1, marginLeft: ".4rem" }}
        >
          {}
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
            onChange={(e) => handleNumericChange(e, "hour")}
            onKeyDown={(e) => handleNumericKeyDown(e, "hour")}
          />

          <Text type="Subheadline" verticalTrim className={styles.Sep}>
            :
          </Text>

          {}
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
            onChange={(e) => handleNumericChange(e, "minute")}
            onKeyDown={(e) => handleNumericKeyDown(e, "minute")}
          />

          {showSeconds && (
            <>
              {}
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
                onChange={(e) => handleNumericChange(e, "second")}
                onKeyDown={(e) => handleNumericKeyDown(e, "second")}
              />
            </>
          )}

          {use12h && (
            <>
              <Text type="Subheadline" verticalTrim className={styles.Sep}>
                &nbsp;
              </Text>

              <View style={{ position: "relative" }}>
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
        </View>
      </View>
    </Label>
  );
}
