export function parseDate(str: string | undefined | null): Date | null {
  if (!str) return null;
  if (str.includes(" ")) {
    const [datePart, timePart] = str.split(" ");
    const d = new Date(`${datePart}T${timePart}:00`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(`${str}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function toYMD(d: Date, showTime?: boolean): string {
  const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  if (!showTime) return dateStr;
  return `${dateStr} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBefore(a: Date, b: Date): boolean {
  return a.getTime() < b.getTime();
}

export function formatDisplay(d: Date | null): string {
  if (!d) return "";
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}

export function formatRangeDisplay(
  start: Date | null,
  end: Date | null,
): string {
  if (!start) return "";
  if (!end) return formatDisplay(start);
  return `${formatDisplay(start)} – ${formatDisplay(end)}`;
}

export function getCalendarDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const startOffset = first.getDay();
  const days: Date[] = [];
  for (let i = 0; i < startOffset; i++) {
    days.push(new Date(year, month, 1 - (startOffset - i)));
  }
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(new Date(year, month, d));
  }
  while (days.length % 7 !== 0) {
    days.push(
      new Date(year, month + 1, days.length - startOffset - daysInMonth + 1),
    );
  }
  return days;
}

export function isDateDisabled(
  date: Date,
  minDate?: string | null,
  maxDate?: string | null,
  disabledDaysOfWeek?: number[],
): boolean {
  if (minDate) {
    const min = parseDate(minDate);
    if (min && date.getTime() < min.getTime()) return true;
  }
  if (maxDate) {
    const max = parseDate(maxDate);
    if (max && date.getTime() > max.getTime()) return true;
  }
  if (disabledDaysOfWeek?.includes(date.getDay())) return true;
  return false;
}
