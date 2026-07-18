"use client";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { normalizeLocale } from "../../../i18n/shared";
import Dialog from "../../Frameworks/Dialog/Dialog";
import View from "../../Frameworks/View/View";
import Icon from "../Icon/Icon";
import Label from "../Label/Label";
import Text from "../Text/Text";
import TimePickerCore, {
  type TimePickerCoreRef,
} from "../TimePicker/TimePicker.core";
import { Calendar } from "./DatePicker.calendar";
import DatePickerCore, { type DatePickerCoreRef } from "./DatePicker.core";
import styles from "./DatePicker.module.scss";
import type { DatePickerProps } from "./DatePicker.types";
import { isBefore, parseDate, toYMD } from "./DatePicker.utils";
import { useCalendar } from "./hooks/useCalendar";
import { useSelection } from "./hooks/useSelection";

function isValidDate(y: number, m: number, d: number): boolean {
  if (y < 1000 || y > 9999) return false;
  if (m < 1 || m > 12) return false;
  const maxDay = new Date(y, m, 0).getDate();
  return d >= 1 && d <= maxDay;
}

function _padYear(n: number | null): string {
  if (n === null) return "";
  return String(n);
}

function _padMonthDay(n: number | null): string {
  if (n === null) return "";
  return String(n);
}

const LOCALE_DATA = {
  ko: {
    months: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    weekdays: ["일", "월", "화", "수", "목", "금", "토"],
    title: (y: number, m: number) => `${y}년 ${m + 1}월`,
  },
  en: {
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    title: (y: number, m: number) => `${LOCALE_DATA.en.months[m]} ${y}`,
  },
  jp: {
    months: [
      "1月",
      "2月",
      "3月",
      "4月",
      "5月",
      "6月",
      "7月",
      "8月",
      "9月",
      "10月",
      "11月",
      "12月",
    ],
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    title: (y: number, m: number) => `${y}年 ${m + 1}月`,
  },
} as const;

function _NavBtn({
  onClick,
  direction,
}: {
  onClick: () => void;
  direction: "prev" | "next";
}) {
  return (
    <Icon
      icon={direction === "prev" ? "iArrowKeyLeft" : "iArrowKeyRight"}
      size={20}
      box
      boxOptions={{ padding: ".8rem" }}
      pressable={{ onClick }}
    />
  );
}

export default function DatePicker({
  title,
  required,
  readOnly,
  disabled,
  hint,
  className,
  style,
  mode = "single",
  value: valueProp,
  defaultValue,
  startDate: startProp,
  endDate: endProp,
  defaultStartDate,
  defaultEndDate,
  placeholder,
  onChange,
  onRangeChange,
  "data-color-mode": dataTheme,
  minDate,
  maxDate,
  disabledDaysOfWeek,
  showTime,
  use12h,
}: DatePickerProps) {
  const rawLocale = normalizeLocale();
  const locale = (
    LOCALE_DATA[rawLocale as keyof typeof LOCALE_DATA] ? rawLocale : "ko"
  ) as keyof typeof LOCALE_DATA;
  const currentLocale = LOCALE_DATA[locale];
  const isControlled =
    mode === "single" ? valueProp !== undefined : startProp !== undefined;
  const isDisabledOrReadOnly = disabled || readOnly;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const popoverOwnerId = useId();
  const suppressOpenUntilRef = useRef(0);

  const initDate =
    parseDate(valueProp ?? defaultValue ?? startProp ?? defaultStartDate) ??
    today;

  const {
    viewYear,
    viewMonth,
    prevMonth,
    nextMonth,
    days,
    setViewYear,
    setViewMonth,
  } = useCalendar({
    initialYear: initDate.getFullYear(),
    initialMonth: initDate.getMonth(),
  });

  const {
    selected,
    rangeStart,
    rangeEnd,
    setHoverDay,
    handleDayClick,
    isInRange,
    isRangeStart,
    isRangeEnd,
    setSelected,
    setRangeStart,
    setRangeEnd,
    displayText,
  } = useSelection({
    mode,
    isControlled,
    value: valueProp,
    defaultValue,
    startDate: startProp,
    endDate: endProp,
    defaultStartDate,
    defaultEndDate,
    onChange,
    onRangeChange,
    onClose: useCallback(() => {
      suppressOpenUntilRef.current = Date.now() + 280;
      setOpen(false);
    }, []),
    minDate,
    maxDate,
    disabledDaysOfWeek,
    showTime,
  });

  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [day, setDay] = useState<number | null>(null);
  const [hour, setHour] = useState<number | null>(null);
  const [minute, setMinute] = useState<number | null>(null);
  const [ampm, setAmpm] = useState<"AM" | "PM">("AM");

  const [startYear, setStartYear] = useState<number | null>(null);
  const [startMonth, setStartMonth] = useState<number | null>(null);
  const [startDay, setStartDay] = useState<number | null>(null);
  const [endYear, setEndYear] = useState<number | null>(null);
  const [endMonth, setEndMonth] = useState<number | null>(null);
  const [endDay, setEndDay] = useState<number | null>(null);
  const [startHour, setStartHour] = useState<number | null>(null);
  const [startMinute, setStartMinute] = useState<number | null>(null);
  const [startAmpm, setStartAmpm] = useState<"AM" | "PM">("AM");
  const [endHour, setEndHour] = useState<number | null>(null);
  const [endMinute, setEndMinute] = useState<number | null>(null);
  const [endAmpm, setEndAmpm] = useState<"AM" | "PM">("AM");

  useEffect(() => {
    if (mode === "single") {
      if (selected) {
        setYear(selected.getFullYear());
        setMonth(selected.getMonth() + 1);
        setDay(selected.getDate());
        setHour(selected.getHours());
        setMinute(selected.getMinutes());
        setAmpm(selected.getHours() >= 12 ? "PM" : "AM");
      } else {
        setYear(null);
        setMonth(null);
        setDay(null);
        setHour(null);
        setMinute(null);
        setAmpm("AM");
      }
    } else {
      if (rangeStart) {
        setStartYear(rangeStart.getFullYear());
        setStartMonth(rangeStart.getMonth() + 1);
        setStartDay(rangeStart.getDate());
        setStartHour(rangeStart.getHours());
        setStartMinute(rangeStart.getMinutes());
        setStartAmpm(rangeStart.getHours() >= 12 ? "PM" : "AM");
      } else {
        setStartYear(null);
        setStartMonth(null);
        setStartDay(null);
        setStartHour(null);
        setStartMinute(null);
        setStartAmpm("AM");
      }
      if (rangeEnd) {
        setEndYear(rangeEnd.getFullYear());
        setEndMonth(rangeEnd.getMonth() + 1);
        setEndDay(rangeEnd.getDate());
        setEndHour(rangeEnd.getHours());
        setEndMinute(rangeEnd.getMinutes());
        setEndAmpm(rangeEnd.getHours() >= 12 ? "PM" : "AM");
      } else {
        setEndYear(null);
        setEndMonth(null);
        setEndDay(null);
        setEndHour(null);
        setEndMinute(null);
        setEndAmpm("AM");
      }
    }
  }, [selected, rangeStart, rangeEnd, mode]);

  const emitSingle = useCallback(
    (
      y: number | null,
      m: number | null,
      d: number | null,
      h: number | null,
      min: number | null,
    ) => {
      if (y === null || m === null || d === null) return;
      if (showTime && (h === null || min === null)) return;
      if (isValidDate(y, m, d)) {
        const parsed = new Date(y, m - 1, d, h ?? 0, min ?? 0);
        if (!isControlled) {
          setSelected(parsed);
        }
        onChange?.(toYMD(parsed, showTime));
      }
    },
    [isControlled, onChange, setSelected, showTime],
  );

  const emitRange = useCallback(
    (
      sy: number | null,
      sm: number | null,
      sd: number | null,
      sh: number | null,
      smin: number | null,
      ey: number | null,
      em: number | null,
      ed: number | null,
      eh: number | null,
      emin: number | null,
    ) => {
      const isStartValid =
        sy !== null &&
        sm !== null &&
        sd !== null &&
        isValidDate(sy, sm, sd) &&
        (!showTime || (sh !== null && smin !== null));
      const isEndValid =
        ey !== null &&
        em !== null &&
        ed !== null &&
        isValidDate(ey, em, ed) &&
        (!showTime || (eh !== null && emin !== null));

      if (
        isStartValid &&
        isEndValid &&
        sy !== null &&
        sm !== null &&
        sd !== null &&
        ey !== null &&
        em !== null &&
        ed !== null
      ) {
        let start = new Date(sy, sm - 1, sd, sh ?? 0, smin ?? 0);
        let end = new Date(ey, em - 1, ed, eh ?? 0, emin ?? 0);
        if (isBefore(end, start)) {
          [start, end] = [end, start];
        }
        if (!isControlled) {
          setRangeStart(start);
          setRangeEnd(end);
        }
        onRangeChange?.(toYMD(start, showTime), toYMD(end, showTime));
      } else if (
        isStartValid &&
        sy !== null &&
        sm !== null &&
        sd !== null &&
        ey === null &&
        em === null &&
        ed === null
      ) {
        const start = new Date(sy, sm - 1, sd, sh ?? 0, smin ?? 0);
        if (!isControlled) {
          setRangeStart(start);
          setRangeEnd(null);
        }
        onRangeChange?.(toYMD(start, showTime), null);
      }
    },
    [isControlled, onRangeChange, setRangeStart, setRangeEnd, showTime],
  );

  const handleDateChange = useCallback(
    (seg: string, val: number | null) => {
      const setter = (() => {
        switch (seg) {
          case "year":
            return setYear;
          case "month":
            return setMonth;
          case "day":
            return setDay;
          case "startYear":
            return setStartYear;
          case "startMonth":
            return setStartMonth;
          case "startDay":
            return setStartDay;
          case "endYear":
            return setEndYear;
          case "endMonth":
            return setEndMonth;
          case "endDay":
            return setEndDay;
          default:
            return null;
        }
      })();
      if (setter) setter(val);

      if (mode === "single") {
        emitSingle(
          seg === "year" ? val : year,
          seg === "month" ? val : month,
          seg === "day" ? val : day,
          hour,
          minute,
        );
      } else {
        emitRange(
          seg === "startYear" ? val : startYear,
          seg === "startMonth" ? val : startMonth,
          seg === "startDay" ? val : startDay,
          startHour,
          startMinute,
          seg === "endYear" ? val : endYear,
          seg === "endMonth" ? val : endMonth,
          seg === "endDay" ? val : endDay,
          endHour,
          endMinute,
        );
      }
    },
    [
      mode,
      year,
      month,
      day,
      hour,
      minute,
      startYear,
      startMonth,
      startDay,
      startHour,
      startMinute,
      endYear,
      endMonth,
      endDay,
      endHour,
      endMinute,
      emitSingle,
      emitRange,
    ],
  );

  const handleTimeChange = useCallback(
    (
      seg: "single" | "start" | "end",
      h: number | null,
      m: number | null,
      _s: number | null,
      a: "AM" | "PM",
    ) => {
      let finalH = h;
      if (use12h && h !== null) {
        let h12 = h % 12;
        if (h12 === 0) h12 = 12;
        if (a === "PM") {
          finalH = h12 === 12 ? 12 : h12 + 12;
        } else {
          finalH = h12 === 12 ? 0 : h12;
        }
      }

      if (seg === "single") {
        setHour(finalH);
        setMinute(m);
        setAmpm(a);
        emitSingle(year, month, day, finalH, m);
      } else if (seg === "start") {
        setStartHour(finalH);
        setStartMinute(m);
        setStartAmpm(a);
        emitRange(
          startYear,
          startMonth,
          startDay,
          finalH,
          m,
          endYear,
          endMonth,
          endDay,
          endHour,
          endMinute,
        );
      } else {
        setEndHour(finalH);
        setEndMinute(m);
        setEndAmpm(a);
        emitRange(
          startYear,
          startMonth,
          startDay,
          startHour,
          startMinute,
          endYear,
          endMonth,
          endDay,
          finalH,
          m,
        );
      }
    },
    [
      emitSingle,
      emitRange,
      year,
      month,
      day,
      startYear,
      startMonth,
      startDay,
      startHour,
      startMinute,
      endYear,
      endMonth,
      endDay,
      endHour,
      endMinute,
      use12h,
    ],
  );

  const singleDateRef = useRef<DatePickerCoreRef | null>(null);
  const singleTimeRef = useRef<TimePickerCoreRef | null>(null);
  const startDateRef = useRef<DatePickerCoreRef | null>(null);
  const startTimeRef = useRef<TimePickerCoreRef | null>(null);
  const endDateRef = useRef<DatePickerCoreRef | null>(null);
  const endTimeRef = useRef<TimePickerCoreRef | null>(null);

  useEffect(() => {
    if (!isControlled) return;
    const d = mode === "single" ? parseDate(valueProp) : parseDate(startProp);
    if (d) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  }, [valueProp, startProp, mode, isControlled, setViewYear, setViewMonth]);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const popoverEl = document.querySelector(
        `[data-popover-owner="${popoverOwnerId}"]`,
      );
      const label = rootRef.current?.closest("label");
      if (label?.contains(target) || popoverEl?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open, popoverOwnerId]);

  return (
    <Label
      data-color-mode={dataTheme}
      title={title}
      required={required}
      readOnly={isDisabledOrReadOnly}
      hint={hint}
      className={className}
      style={{ overflow: "visible", ...style }}
      cursor="text"
    >
      <View
        ref={rootRef}
        alignItems="flex-end"
        justifyContent="space-between"
        gap={4}
        fullWidth
        style={{ position: "relative", overflow: "visible" }}
      >
        <View
          gap={2}
          column={mode === "range" && showTime}
          style={{ overflow: "hidden", whiteSpace: "nowrap" }}
        >
          {mode === "single" ? (
            <View alignItems="center" gap={2} row>
              <DatePickerCore
                ref={singleDateRef}
                mode="single"
                year={year}
                month={month}
                day={day}
                startYear={null}
                startMonth={null}
                startDay={null}
                endYear={null}
                endMonth={null}
                endDay={null}
                today={today}
                disabled={isDisabledOrReadOnly}
                readOnly={isDisabledOrReadOnly}
                onDateChange={handleDateChange}
                onFocusNext={() =>
                  showTime ? singleTimeRef.current?.focusFirst() : undefined
                }
              />
              {showTime && (
                <TimePickerCore
                  ref={singleTimeRef}
                  hour={hour}
                  minute={minute}
                  second={null}
                  ampm={ampm}
                  use12h={use12h}
                  disabled={isDisabledOrReadOnly}
                  readOnly={isDisabledOrReadOnly}
                  onTimeChange={(h, m, s, a) =>
                    handleTimeChange("single", h, m, s, a)
                  }
                  onFocusPrev={() => singleDateRef.current?.focusLast()}
                />
              )}
            </View>
          ) : showTime ? (
            <>
              <View alignItems="center" gap={2} row>
                <DatePickerCore
                  ref={startDateRef}
                  mode="single"
                  year={startYear}
                  month={startMonth}
                  day={startDay}
                  startYear={null}
                  startMonth={null}
                  startDay={null}
                  endYear={null}
                  endMonth={null}
                  endDay={null}
                  today={today}
                  disabled={isDisabledOrReadOnly}
                  readOnly={isDisabledOrReadOnly}
                  onDateChange={(seg, val) =>
                    handleDateChange(
                      seg === "year"
                        ? "startYear"
                        : seg === "month"
                          ? "startMonth"
                          : "startDay",
                      val,
                    )
                  }
                  onFocusNext={() => startTimeRef.current?.focusFirst()}
                />
                <TimePickerCore
                  ref={startTimeRef}
                  hour={startHour}
                  minute={startMinute}
                  second={null}
                  ampm={startAmpm}
                  use12h={use12h}
                  disabled={isDisabledOrReadOnly}
                  readOnly={isDisabledOrReadOnly}
                  onTimeChange={(h, m, s, a) =>
                    handleTimeChange("start", h, m, s, a)
                  }
                  onFocusPrev={() => startDateRef.current?.focusLast()}
                  onFocusNext={() => endDateRef.current?.focusFirst()}
                />
                <Text
                  type="Subheadline"
                  verticalTrim
                  className={styles.RangeSep}
                >
                  –
                </Text>
              </View>
              <View alignItems="center" gap={2}>
                <DatePickerCore
                  ref={endDateRef}
                  mode="single"
                  year={endYear}
                  month={endMonth}
                  day={endDay}
                  startYear={null}
                  startMonth={null}
                  startDay={null}
                  endYear={null}
                  endMonth={null}
                  endDay={null}
                  today={today}
                  disabled={isDisabledOrReadOnly}
                  readOnly={isDisabledOrReadOnly}
                  onDateChange={(seg, val) =>
                    handleDateChange(
                      seg === "year"
                        ? "endYear"
                        : seg === "month"
                          ? "endMonth"
                          : "endDay",
                      val,
                    )
                  }
                  onFocusPrev={() => startTimeRef.current?.focusLast()}
                  onFocusNext={() => endTimeRef.current?.focusFirst()}
                />
                <TimePickerCore
                  ref={endTimeRef}
                  hour={endHour}
                  minute={endMinute}
                  second={null}
                  ampm={endAmpm}
                  use12h={use12h}
                  disabled={isDisabledOrReadOnly}
                  readOnly={isDisabledOrReadOnly}
                  onTimeChange={(h, m, s, a) =>
                    handleTimeChange("end", h, m, s, a)
                  }
                  onFocusPrev={() => endDateRef.current?.focusLast()}
                />
              </View>
            </>
          ) : (
            <DatePickerCore
              ref={startDateRef}
              mode="range"
              year={null}
              month={null}
              day={null}
              startYear={startYear}
              startMonth={startMonth}
              startDay={startDay}
              endYear={endYear}
              endMonth={endMonth}
              endDay={endDay}
              today={today}
              disabled={isDisabledOrReadOnly}
              readOnly={isDisabledOrReadOnly}
              onDateChange={handleDateChange}
            />
          )}
        </View>
        <Icon
          icon="iDateRange"
          size={16}
          opacity={0.8}
          box
          boxOptions={{
            padding: 6,
            margin: -4,
          }}
          pressable={{
            ref: arrowRef,
            disabled: isDisabledOrReadOnly,
            onClick: () => {
              if (!isDisabledOrReadOnly) {
                if (Date.now() < suppressOpenUntilRef.current) return;
                setOpen((o) => !o);
              }
            },
          }}
        />

        <Dialog
          mode="popover"
          open={open}
          onOpenChange={setOpen}
          popover={{
            anchorRef: arrowRef as any,
            strategy: "anchored",
            placement: "bottom-end",
            recalcKey: `${viewYear}|${viewMonth}|${mode}`,
            popoverOwnerId: popoverOwnerId,
            style: {
              padding: ".8rem",
              width: "clamp(16rem, calc(100vw - 5.6rem), 32rem)",
              overflow: "hidden",
            },
          }}
          mobileMode="sheet"
        >
          <Calendar
            currentLocale={currentLocale as any}
            viewYear={viewYear}
            viewMonth={viewMonth}
            prevMonth={prevMonth}
            nextMonth={nextMonth}
            days={days}
            mode={mode}
            minDate={minDate}
            maxDate={maxDate}
            disabledDaysOfWeek={disabledDaysOfWeek}
            selected={selected}
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            today={today}
            setHoverDay={setHoverDay}
            handleDayClick={handleDayClick}
            isInRange={isInRange}
            isRangeStart={isRangeStart}
            isRangeEnd={isRangeEnd}
          />
        </Dialog>
      </View>
    </Label>
  );
}
