"use client";

import {
  addUtcDays,
  formatUtcDateKey,
  getUtcWeekdayIndex,
  parseUtcDateInput,
} from "@musecat/functionkit";
import {
  type PointerEvent as ReactPointerEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { Word } from "../../../i18n/shared";
import View from "../../frameworks/View/View";
import Box from "../Box/Box";
import Text from "../Text/Text";
import styles from "./ContributionGraph.module.scss";
import type { ContributionGraphProps } from "./ContributionGraph.types";

const DAY_LABEL_KEYS = [
  "sun",
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
] as const;
const VISIBLE_DAY_INDICES = [1, 3, 5] as const;

function normalizeLocale(locale?: string) {
  if (!locale) return "en";
  if (locale === "kr") return "ko-KR";
  if (locale === "jp") return "ja-JP";
  return locale;
}

function parseGraphDate(value?: string | Date) {
  return parseUtcDateInput(value, new Date()) ?? new Date();
}

function getRollingYearVisibleDays(endDate: Date) {
  const end = parseUtcDateInput(endDate, new Date()) ?? new Date();
  const start = addUtcDays(end, 1);
  start.setUTCFullYear(start.getUTCFullYear() - 1);

  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / 86400000) + 1;
}

function buildCellTitle(cell: {
  date: string;
  total_count?: number;
  changelog_count?: number;
  flag_count?: number;
  legacy_ticket_count?: number;
}) {
  return [
    cell.date,
    `total_count: ${cell.total_count ?? 0}`,
    `changelog_count: ${cell.changelog_count ?? 0}`,
    `flag_count: ${cell.flag_count ?? 0}`,
    `legacy_ticket_count: ${cell.legacy_ticket_count ?? 0}`,
  ].join("\n");
}

function GraphCell({
  date,
  level,
  total_count,
  changelog_count,
  flag_count,
  legacy_ticket_count,
  inRange,
  weekIndex,
  dayIndex,
}: {
  date: string;
  level: number;
  total_count?: number;
  changelog_count?: number;
  flag_count?: number;
  legacy_ticket_count?: number;
  inRange: boolean;
  weekIndex: number;
  dayIndex: number;
}) {
  return (
    <View
      border={["Base6TP2", "Regular"]}
      radius={4}
      className={styles.Cell}
      data-level={level}
      data-in-range={inRange ? "true" : "false"}
      title={buildCellTitle({
        date,
        total_count,
        changelog_count,
        flag_count,
        legacy_ticket_count,
      })}
      style={{
        gridColumn: `${weekIndex + 1}`,
        gridRow: `${dayIndex + 1}`,
      }}
    />
  );
}

function MonthLabel({ title, colIndex }: { title: string; colIndex: number }) {
  return (
    <Text
      verticalTrim
      type="Caption1"
      weight={400}
      style={{
        position: "absolute",
        top: 0,
        left: `calc(${colIndex} * (var(--contribution-cell-size) + var(--contribution-cell-gap)))`,
      }}
    >
      {title}
    </Text>
  );
}

export default function ContributionGraph({
  data = [],
  endDate,
  visibleDays,
  locale,
  className,
  style,
  "data-color-mode": dataTheme,
  themePreset,
  background,
  color,
  border,
  shadow,
  radius,
  themeInteractive,
  selected,
  disabled,
  readOnly,
  backgroundBlur,
}: ContributionGraphProps) {
  const t = Word();
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const resolvedLocale = useMemo(() => normalizeLocale(locale), [locale]);
  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(resolvedLocale, {
        month: "short",
        timeZone: "UTC",
      }),
    [resolvedLocale],
  );
  const weekdayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(resolvedLocale, {
        weekday: "short",
        timeZone: "UTC",
      }),
    [resolvedLocale],
  );
  const dayLabels = useMemo(
    () =>
      DAY_LABEL_KEYS.map((key, index) => {
        if (
          !VISIBLE_DAY_INDICES.includes(
            index as (typeof VISIBLE_DAY_INDICES)[number],
          )
        ) {
          return { key, label: "" };
        }

        const sampleDate = new Date(Date.UTC(2024, 0, 7 + index));
        return {
          key,
          label: weekdayFormatter.format(sampleDate).replace(/\.$/, ""),
        };
      }),
    [weekdayFormatter],
  );

  const graphData = useMemo(() => {
    const resolvedEndDate = parseGraphDate(endDate);

    const resolvedVisibleDays =
      visibleDays !== undefined
        ? Math.max(1, Math.floor(visibleDays))
        : getRollingYearVisibleDays(resolvedEndDate);
    const end = new Date(resolvedEndDate);

    const visibleStart = addUtcDays(end, -(resolvedVisibleDays - 1));

    const start = addUtcDays(visibleStart, -getUtcWeekdayIndex(visibleStart));

    const alignedEnd = new Date(end);
    alignedEnd.setUTCDate(
      alignedEnd.getUTCDate() + (6 - getUtcWeekdayIndex(alignedEnd)),
    );

    const actMap = new Map<
      string,
      {
        level: number;
        total_count?: number;
        changelog_count?: number;
        flag_count?: number;
        legacy_ticket_count?: number;
      }
    >();
    for (const item of data) {
      const d = parseGraphDate(item.date);
      const dateStr = formatUtcDateKey(d);
      actMap.set(dateStr, {
        level: item.level,
        total_count: item.total_count,
        changelog_count: item.changelog_count,
        flag_count: item.flag_count,
        legacy_ticket_count: item.legacy_ticket_count,
      });
    }

    const cells: Array<{
      date: string;
      level: number;
      total_count?: number;
      changelog_count?: number;
      flag_count?: number;
      legacy_ticket_count?: number;
      inRange: boolean;
      weekIndex: number;
      dayIndex: number;
    }> = [];
    const months: Array<{ title: string; colIndex: number }> = [];
    const current = new Date(start);
    let dayIndex = 0;

    while (current <= alignedEnd) {
      const weekIndex = Math.floor(dayIndex / 7);

      if (current.getUTCDate() === 1) {
        months.push({
          title: monthFormatter.format(
            new Date(
              Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), 1),
            ),
          ),
          colIndex: weekIndex,
        });
      }

      const dateStr = formatUtcDateKey(current);
      const activity = actMap.get(dateStr);
      const level = activity?.level ?? 0;
      const inRange = current >= visibleStart && current <= end;
      cells.push({
        date: dateStr,
        level,
        total_count: activity?.total_count,
        changelog_count: activity?.changelog_count,
        flag_count: activity?.flag_count,
        legacy_ticket_count: activity?.legacy_ticket_count,
        inRange,
        weekIndex,
        dayIndex: getUtcWeekdayIndex(current),
      });

      current.setUTCDate(current.getUTCDate() + 1);
      dayIndex += 1;
    }

    return {
      cells,
      months,
      weekCount: Math.ceil(cells.length / 7),
    };
  }, [data, endDate, monthFormatter, visibleDays]);

  const boxStyle = useMemo(
    () =>
      ({
        "--contribution-cell-size": "1.2rem",
        "--contribution-cell-gap": "0.4rem",
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        padding: 0,
        overflow: "hidden",
        ...style,
      }) as React.CSSProperties,
    [style],
  );

  const finishDrag = (pointerId: number) => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea?.hasPointerCapture(pointerId)) {
      scrollArea.releasePointerCapture(pointerId);
    }
    dragStateRef.current = null;
    setIsDragging(false);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;

    const scrollArea = scrollAreaRef.current;
    if (!scrollArea || scrollArea.scrollWidth <= scrollArea.clientWidth) return;

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: scrollArea.scrollLeft,
    };
    setIsDragging(true);
    scrollArea.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    const scrollArea = scrollAreaRef.current;
    if (!dragState || !scrollArea || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    scrollArea.scrollLeft = dragState.startScrollLeft - deltaX;
    event.preventDefault();
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.pointerId !== event.pointerId) return;
    finishDrag(event.pointerId);
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStateRef.current?.pointerId !== event.pointerId) return;
    finishDrag(event.pointerId);
  };

  return (
    <Box
      className={className}
      style={boxStyle}
      data-color-mode={dataTheme}
      themePreset={themePreset}
      background={background}
      color={color}
      border={border}
      shadow={shadow}
      radius={radius}
      themeInteractive={themeInteractive}
      selected={selected}
      disabled={disabled}
      readOnly={readOnly}
      backgroundBlur={backgroundBlur}
    >
      <View column gap={12}>
        <View
          ref={scrollAreaRef}
          className={styles.ScrollArea}
          data-dragging={isDragging ? "true" : "false"}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <View
            column
            gap={10}
            style={
              {
                "--contribution-weeks": String(graphData.weekCount),
              } as React.CSSProperties
            }
          >
            {}
            <View
              opacity={0.6}
              height="var(--font-footnote-size)"
              style={{ position: "relative", marginLeft: "3.6rem" }}
            >
              {graphData.months.map((m) => (
                <MonthLabel
                  key={`${m.title}-${m.colIndex}`}
                  title={m.title}
                  colIndex={m.colIndex}
                />
              ))}
            </View>

            {}
            <View gap={10}>
              {}
              <View
                column
                opacity={0.6}
                width="2.8rem"
                style={{ textAlign: "right" }}
                gridTemplateRows="repeat(7, var(--contribution-cell-size))"
                gap={4}
              >
                {dayLabels.map((day) => (
                  <Text key={day.key} verticalTrim type="Caption1" weight={400}>
                    {day.label}
                  </Text>
                ))}
              </View>

              <View
                className={styles.Grid}
                gridTemplateColumns="repeat(var(--contribution-weeks), var(--contribution-cell-size))"
                gridTemplateRows="repeat(7, var(--contribution-cell-size))"
                gap={4}
              >
                {graphData.cells.map((cell) => (
                  <GraphCell key={cell.date} {...cell} />
                ))}
              </View>
            </View>
          </View>
        </View>

        {}
        <View
          padding={[0, 12, 12, 12]}
          justifyContent="flex-end"
          alignItems="center"
          gap={8}
        >
          <Text type="Caption1" opacity={0.6}>
            {t.UIKit.ui.less}
          </Text>
          <View gap={4} aria-hidden="true">
            {[0, 1, 2, 3, 4].map((level) => (
              <View
                border={["Base6TP2", "Regular"]}
                radius={4}
                key={level}
                className={styles.LegendCell}
                data-level={level}
              />
            ))}
          </View>
          <Text type="Caption1" opacity={0.6}>
            {t.UIKit.ui.more}
          </Text>
        </View>
      </View>
    </Box>
  );
}
