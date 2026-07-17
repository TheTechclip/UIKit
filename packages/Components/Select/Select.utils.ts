import type {
  OptGroup,
  Option,
} from "./Select.types";

type ScrollLockSnapshot = {
  count: number;
  overflowY: string;
  overscrollBehavior: string;
};
const ancestorScrollLockMap = new WeakMap<HTMLElement, ScrollLockSnapshot>();
const lockScrollElement = (element: HTMLElement) => {
  const snapshot = ancestorScrollLockMap.get(element);
  if (snapshot) {
    ancestorScrollLockMap.set(element, {
      ...snapshot,
      count: snapshot.count + 1,
    });
    return;
  }
  ancestorScrollLockMap.set(element, {
    count: 1,
    overflowY: element.style.overflowY,
    overscrollBehavior: element.style.overscrollBehavior,
  });
  element.style.overflowY = "hidden";
  element.style.overscrollBehavior = "contain";
};
const unlockScrollElement = (element: HTMLElement) => {
  const snapshot = ancestorScrollLockMap.get(element);
  if (!snapshot) return;
  if (snapshot.count > 1) {
    ancestorScrollLockMap.set(element, {
      ...snapshot,
      count: snapshot.count - 1,
    });
    return;
  }
  element.style.overflowY = snapshot.overflowY;
  element.style.overscrollBehavior = snapshot.overscrollBehavior;
  ancestorScrollLockMap.delete(element);
};

export const findScrollableAncestor = (element: HTMLElement | null) => {
  if (!element) return null;
  let current: HTMLElement | null = element.parentElement;
  while (current) {
    const computed = window.getComputedStyle(current);
    const canScrollY = /(auto|scroll|overlay)/.test(computed.overflowY);
    if (canScrollY && current.scrollHeight > current.clientHeight) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
};

export const lockScrollElementSafe = lockScrollElement;
export const unlockScrollElementSafe = unlockScrollElement;

export const isOptGroup = (item: Option | OptGroup): item is OptGroup =>
  (item as OptGroup).options !== undefined;

export const filterOptionsByQuery = (items: Option[], rawQuery: string) => {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (o) =>
      o.label.toLowerCase().includes(q) ||
      o.description?.toLowerCase().includes(q),
  );
};

const toStringArray = (input?: unknown) => {
  if (Array.isArray(input)) return input.map((item) => String(item));
  if (typeof input === "string" || typeof input === "number")
    return [String(input)];
  return [];
};
export const getStringValues = (value?: unknown, defaultValue?: unknown) => {
  const fromValue = toStringArray(value);
  if (fromValue.length) return fromValue;
  return toStringArray(defaultValue);
};
