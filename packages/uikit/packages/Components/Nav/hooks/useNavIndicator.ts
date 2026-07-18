"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export function useNavIndicator(
  committedSelectedIndex: number,
  isDraggingSelection: boolean,
  isReleasingSelection: boolean,
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>,
  indicatorRef: React.RefObject<HTMLDivElement | null>,
  navRef: React.RefObject<HTMLDivElement | null>,
) {
  const committedIndicatorStyleRef = useRef<React.CSSProperties | undefined>(
    undefined,
  );

  const applyIndicatorStyle = useCallback(
    (nextStyle?: React.CSSProperties) => {
      const indicator = indicatorRef.current;
      if (!indicator) return;

      const left =
        typeof nextStyle?.left === "number"
          ? nextStyle.left
          : Number(nextStyle?.left ?? 0);
      const width =
        typeof nextStyle?.width === "number"
          ? nextStyle.width
          : Number(nextStyle?.width ?? 0);
      const opacity =
        typeof nextStyle?.opacity === "number"
          ? nextStyle.opacity
          : Number(nextStyle?.opacity ?? 0);

      indicator.style.transform = `translate3d(${left}px, 0, 0) scale(var(--nav-indicator-scale, 1))`;
      indicator.style.width = `${width}px`;
      indicator.style.opacity = `${opacity}`;
    },
    [indicatorRef],
  );

  useLayoutEffect(() => {
    const el =
      committedSelectedIndex >= 0
        ? itemRefs.current[committedSelectedIndex]
        : null;

    if (el) {
      const nextStyle = {
        left: el.offsetLeft,
        width: el.offsetWidth,
        opacity: 1,
      };
      committedIndicatorStyleRef.current = nextStyle;

      if (!isDraggingSelection && !isReleasingSelection) {
        requestAnimationFrame(() => {
          if (!isDraggingSelection && !isReleasingSelection) {
            applyIndicatorStyle(nextStyle);
          }
        });
      }
    } else {
      const nextStyle = { left: 0, width: 0, opacity: 0 };
      committedIndicatorStyleRef.current = nextStyle;

      if (!isDraggingSelection && !isReleasingSelection) {
        requestAnimationFrame(() => {
          if (!isDraggingSelection && !isReleasingSelection) {
            applyIndicatorStyle(nextStyle);
          }
        });
      }
    }
  }, [
    applyIndicatorStyle,
    committedSelectedIndex,
    isDraggingSelection,
    isReleasingSelection,
    itemRefs,
  ]);

  useEffect(() => {
    const syncCommittedIndicator = () => {
      const el =
        committedSelectedIndex >= 0
          ? itemRefs.current[committedSelectedIndex]
          : null;

      if (el) {
        const nextStyle = {
          left: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        };
        committedIndicatorStyleRef.current = nextStyle;

        if (!isDraggingSelection && !isReleasingSelection) {
          requestAnimationFrame(() => {
            if (!isDraggingSelection && !isReleasingSelection) {
              applyIndicatorStyle(nextStyle);
            }
          });
        }
      }
    };

    syncCommittedIndicator();
    window.addEventListener("resize", syncCommittedIndicator);

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => syncCommittedIndicator())
        : null;

    if (resizeObserver) {
      if (navRef.current) resizeObserver.observe(navRef.current);
      itemRefs.current.forEach((item) => {
        if (item) resizeObserver.observe(item);
      });
    }

    return () => {
      window.removeEventListener("resize", syncCommittedIndicator);
      resizeObserver?.disconnect();
    };
  }, [
    applyIndicatorStyle,
    committedSelectedIndex,
    isDraggingSelection,
    isReleasingSelection,
    itemRefs,
    navRef,
  ]);

  return { applyIndicatorStyle, committedIndicatorStyleRef };
}
