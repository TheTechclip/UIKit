"use client";

import { useCallback, useRef } from "react";
import type { Option } from "./Select.types";

const TYPE_AHEAD_RESET_MS = 500;

export function useTypeAhead(
  options: Option[],
  activeIndex: number,
  setActiveIndex: (index: number) => void,
  isOptionSelectionDisabled: (option: Option) => boolean,
) {
  const bufferRef = useRef("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearBuffer = useCallback(() => {
    bufferRef.current = "";
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleTypeAhead = useCallback(
    (char: string) => {
      bufferRef.current += char.toLowerCase();
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(clearBuffer, TYPE_AHEAD_RESET_MS);
      const idx = options.findIndex(
        (o, i) =>
          i !== activeIndex &&
          !isOptionSelectionDisabled(o) &&
          o.label.toLowerCase().startsWith(bufferRef.current),
      );
      if (idx >= 0) {
        setActiveIndex(idx);
      }
    },
    [
      options,
      activeIndex,
      isOptionSelectionDisabled,
      setActiveIndex,
      clearBuffer,
    ],
  );

  return { handleTypeAhead, clearTypeAhead: clearBuffer };
}

export function handleHomeKey<T>(
  options: T[],
  isOptionDisabled: (option: T) => boolean,
): number {
  for (let i = 0; i < options.length; i++) {
    if (!isOptionDisabled(options[i])) return i;
  }
  return -1;
}

export function handleEndKey<T>(
  options: T[],
  isOptionDisabled: (option: T) => boolean,
): number {
  for (let i = options.length - 1; i >= 0; i--) {
    if (!isOptionDisabled(options[i])) return i;
  }
  return -1;
}

export function isPrintableCharacter(key: string): boolean {
  return key.length === 1 && key !== " ";
}
