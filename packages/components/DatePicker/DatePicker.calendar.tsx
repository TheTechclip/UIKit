"use client";

import Pressable from "../../frameworks/Pressable/Pressable";
import View from "../../frameworks/View/View";
import Icon from "../Icon/Icon";
import Text from "../Text/Text";
import { isDateDisabled, isSameDay, toYMD } from "./DatePicker.date";
import styles from "./DatePicker.module.scss";

function NavBtn({
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

export interface CalendarProps {
  currentLocale: {
    weekdays: readonly string[];
    title: (y: number, m: number) => string;
  };
  viewYear: number;
  viewMonth: number;
  prevMonth: () => void;
  nextMonth: () => void;
  days: Date[];
  mode: "single" | "range";
  minDate?: string;
  maxDate?: string;
  disabledDaysOfWeek?: number[];
  selected?: Date | null;
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
  today: Date;
  setHoverDay: (d: Date | null) => void;
  handleDayClick: (d: Date) => void;
  isInRange: (d: Date) => boolean;
  isRangeStart: (d: Date) => boolean;
  isRangeEnd: (d: Date) => boolean;
}

export function Calendar({
  currentLocale,
  viewYear,
  viewMonth,
  prevMonth,
  nextMonth,
  days,
  mode,
  minDate,
  maxDate,
  disabledDaysOfWeek,
  selected,
  rangeStart,
  rangeEnd,
  today,
  setHoverDay,
  handleDayClick,
  isInRange,
  isRangeStart,
  isRangeEnd,
}: CalendarProps) {
  return (
    <View column gap={16} fullWidth>
      <View alignItems="center" justifyContent="space-between">
        <NavBtn direction="prev" onClick={prevMonth} />
        <Text type="Subheadline" weight={500} opacity={0.8}>
          {currentLocale.title(viewYear, viewMonth)}
        </Text>
        <NavBtn direction="next" onClick={nextMonth} />
      </View>

      <View
        className={styles.WeekRow}
        gridTemplateColumns="repeat(7, minmax(0, 1fr))"
        gap={2}
      >
        {currentLocale.weekdays.map((w) => (
          <View key={w} justifyContent="center">
            <Text
              type="Footnote"
              weight={400}
              opacity={0.8}
              textAlign="center"
              verticalTrim
            >
              {w}
            </Text>
          </View>
        ))}
      </View>

      <View gridTemplateColumns="repeat(7, minmax(0, 1fr))" gap={2}>
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === viewMonth;
          const isDisabledDay = isDateDisabled(
            day,
            minDate,
            maxDate,
            disabledDaysOfWeek,
          );
          const isSel = mode === "single" && isSameDay(day, selected ?? null);
          const isStart = mode === "range" && isRangeStart(day);
          const isEnd = mode === "range" && isRangeEnd(day);
          const inRange = isInRange(day);
          const isToday = isSameDay(day, today);
          const isUnselectable = isDisabledDay;
          return (
            <Pressable
              key={toYMD(day)}
              radius="Circle"
              alignItems="center"
              justifyContent="center"
              opacity={!isCurrentMonth || isDisabledDay ? 0.2 : undefined}
              themePreset={
                isSel || isStart || isEnd
                  ? "ReversedUIPrimary"
                  : inRange
                    ? "UISecondary"
                    : isToday && !isUnselectable
                      ? "BaseFull"
                      : undefined
              }
              style={{
                aspectRatio: 1,
                position: "relative",
                cursor:
                  !isCurrentMonth || isDisabledDay ? "default" : "pointer",
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => !isUnselectable && handleDayClick(day)}
              onMouseEnter={() =>
                mode === "range" && rangeStart && !rangeEnd && setHoverDay(day)
              }
              onMouseLeave={() => mode === "range" && setHoverDay(null)}
            >
              <Text type="Body" weight={isSel || isStart || isEnd ? 500 : 400}>
                {day.getDate()}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
