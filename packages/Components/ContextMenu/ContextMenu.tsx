"use client";

import { useViewportMatch } from "@musecat/functionkit";
import {
  type ReactElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Word } from "@/i18n/shared";
import ContextMenuOption from "@/packages/Components/ContextMenu/ContextMenu.options";
import type {
  ContentItem,
  ContextMenuProps,
} from "@/packages/Components/ContextMenu/ContextMenu.types";
import {
  handleEndKey,
  handleHomeKey,
} from "@/packages/Components/Select/Select.keyboard";
import Text from "@/packages/Components/Text/Text";
import Dialog from "@/packages/Frameworks/Dialog/Dialog";
import View from "@/packages/Frameworks/View/View";

const clampScrollTop = (element: HTMLElement, nextScrollTop: number) => {
  const maxScrollTop = Math.max(0, element.scrollHeight - element.clientHeight);
  return Math.max(0, Math.min(maxScrollTop, nextScrollTop));
};

const isItemDisabled = (item: ContentItem) => item.disabled ?? false;

export default function ContextMenu(props: ContextMenuProps): ReactElement {
  const t = Word();
  const {
    open,
    onOpenChange,
    anchorRef,
    popoverOwnerId,
    listId,
    listLabelId,
    role,
    isInteractionDisabled,
    contents,
    recalcKey,
    popoverConfig,
    sheetConfig,
    exit,
    mobileMode,
    children,
    showCheck,
    activeIndex: activeIndexProp,
    onActiveIndexChange,
    openSource: openSourceProp,
    onOpenSourceChange,
  } = props;

  const isMobile = useViewportMatch("(max-width: 549.98px)");
  const isSheetMode = mobileMode === "sheet" && isMobile;

  const isActiveIndexControlled = activeIndexProp !== undefined;
  const [activeIndexState, setActiveIndexState] = useState(-1);
  const activeIndex = isActiveIndexControlled
    ? activeIndexProp
    : activeIndexState;
  const setActiveIndex = isActiveIndexControlled
    ? (onActiveIndexChange ?? setActiveIndexState)
    : setActiveIndexState;

  const isOpenSourceControlled = openSourceProp !== undefined;
  const [openSourceState, setOpenSourceState] = useState<"mouse" | "keyboard">(
    "mouse",
  );
  const openSource = isOpenSourceControlled ? openSourceProp : openSourceState;
  const setOpenSource = isOpenSourceControlled
    ? (onOpenSourceChange ?? setOpenSourceState)
    : setOpenSourceState;

  const getFirstEnabledIndex = useCallback(
    (items: ContentItem[]) => items.findIndex((item) => !isItemDisabled(item)),
    [],
  );
  const getNextEnabledIndex = useCallback(
    (items: ContentItem[], start: number, direction: 1 | -1) => {
      if (!items.length) return -1;
      let idx = start;
      for (let i = 0; i < items.length; i += 1) {
        idx += direction;
        if (idx < 0) idx = items.length - 1;
        if (idx >= items.length) idx = 0;
        if (items[idx] && !isItemDisabled(items[idx])) return idx;
      }
      return -1;
    },
    [],
  );

  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;
  const openRef = useRef(open);
  openRef.current = open;

  const ensureActiveOptionVisible = useCallback(() => {
    if (!openRef.current || activeIndexRef.current < 0) return;
    const listEl = document.getElementById(listId) as HTMLElement | null;
    const activeEl = document.getElementById(
      `${listId}-${activeIndexRef.current}`,
    ) as HTMLElement | null;
    if (!listEl || !activeEl || listEl.scrollHeight <= listEl.clientHeight) {
      return;
    }
    const computedStyle = window.getComputedStyle(listEl);
    const paddingTop = Number.parseFloat(computedStyle.paddingTop) || 0;
    const paddingBottom = Number.parseFloat(computedStyle.paddingBottom) || 0;
    const listRect = listEl.getBoundingClientRect();
    const safeTop = listRect.top + paddingTop;
    const safeBottom = listRect.bottom - paddingBottom;
    const activeRect = activeEl.getBoundingClientRect();
    if (openSource !== "keyboard") {
      if (activeRect.top < safeTop) {
        listEl.scrollTop = clampScrollTop(
          listEl,
          listEl.scrollTop - (safeTop - activeRect.top),
        );
        return;
      }
      if (activeRect.bottom > safeBottom) {
        listEl.scrollTop = clampScrollTop(
          listEl,
          listEl.scrollTop + (activeRect.bottom - safeBottom),
        );
      }
      return;
    }
    const activeHalfHeight = activeRect.height / 2;
    const desiredCenterY = Math.min(
      safeBottom - activeHalfHeight,
      Math.max(safeTop + activeHalfHeight, listRect.top + listRect.height / 2),
    );
    const currentCenterY = activeRect.top + activeHalfHeight;
    const nextScrollTop = clampScrollTop(
      listEl,
      listEl.scrollTop + (currentCenterY - desiredCenterY),
    );
    if (nextScrollTop !== listEl.scrollTop) {
      listEl.scrollTop = nextScrollTop;
    }
  }, [listId, openSource]);

  const ensureVisibleRafRef = useRef<number | null>(null);
  const ensureActiveOptionVisibleRafRef = useRef<number | null>(null);
  const ensureControlVisible = useCallback(() => {
    const controlEl = anchorRef.current;
    if (!controlEl) return;
    controlEl.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [anchorRef]);
  const scheduleEnsureControlVisible = useCallback(() => {
    if (ensureVisibleRafRef.current !== null) {
      cancelAnimationFrame(ensureVisibleRafRef.current);
    }
    const outerRafId = requestAnimationFrame(() => {
      ensureVisibleRafRef.current = requestAnimationFrame(() => {
        ensureControlVisible();
        ensureVisibleRafRef.current = null;
      });
    });
    ensureVisibleRafRef.current = outerRafId;
  }, [ensureControlVisible]);
  const scheduleEnsureActiveOptionVisible = useCallback(() => {
    if (ensureActiveOptionVisibleRafRef.current !== null) {
      cancelAnimationFrame(ensureActiveOptionVisibleRafRef.current);
    }
    const outerRafId = requestAnimationFrame(() => {
      ensureActiveOptionVisibleRafRef.current = requestAnimationFrame(() => {
        ensureActiveOptionVisible();
        ensureActiveOptionVisibleRafRef.current = null;
      });
    });
    ensureActiveOptionVisibleRafRef.current = outerRafId;
  }, [ensureActiveOptionVisible]);

  useLayoutEffect(() => {
    if (!open || activeIndex < 0 || openSource !== "keyboard") return;
    ensureActiveOptionVisible();
    scheduleEnsureActiveOptionVisible();
  }, [
    activeIndex,
    ensureActiveOptionVisible,
    open,
    openSource,
    scheduleEnsureActiveOptionVisible,
  ]);

  useEffect(() => {
    return () => {
      if (ensureVisibleRafRef.current !== null) {
        cancelAnimationFrame(ensureVisibleRafRef.current);
      }
      if (ensureActiveOptionVisibleRafRef.current !== null) {
        cancelAnimationFrame(ensureActiveOptionVisibleRafRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleViewportShift = () => {
      const active = document.activeElement as Node | null;
      if (!active || !anchorRef.current?.contains(active)) return;
      scheduleEnsureControlVisible();
      scheduleEnsureActiveOptionVisible();
    };
    window.addEventListener("resize", handleViewportShift);
    window.visualViewport?.addEventListener("resize", handleViewportShift);
    window.visualViewport?.addEventListener("scroll", handleViewportShift);
    return () => {
      window.removeEventListener("resize", handleViewportShift);
      window.visualViewport?.removeEventListener("resize", handleViewportShift);
      window.visualViewport?.removeEventListener("scroll", handleViewportShift);
    };
  }, [
    anchorRef,
    scheduleEnsureActiveOptionVisible,
    scheduleEnsureControlVisible,
  ]);

  useEffect(() => {
    if (!open || isInteractionDisabled) return;
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.isComposing) return;
      const target = e.target as HTMLElement | null;
      const within =
        anchorRef.current?.contains(target) ||
        !!target?.closest(`[data-popover-owner="${popoverOwnerId}"]`);
      if (!within) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        e.stopPropagation();
        setOpenSource("keyboard");
        setActiveIndex((prev) =>
          e.key === "ArrowDown"
            ? getNextEnabledIndex(contents, prev < 0 ? -1 : prev, 1)
            : getNextEnabledIndex(contents, prev < 0 ? 0 : prev, -1),
        );
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        e.stopPropagation();
        const idx = handleHomeKey(contents, isItemDisabled);
        if (idx >= 0) setActiveIndex(idx);
        return;
      }
      if (e.key === "End") {
        e.preventDefault();
        e.stopPropagation();
        const idx = handleEndKey(contents, isItemDisabled);
        if (idx >= 0) setActiveIndex(idx);
        return;
      }
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      const isSelectionKey = e.key === "Enter" || (!isInput && e.key === " ");
      if (isSelectionKey) {
        e.preventDefault();
        e.stopPropagation();
        const fallbackIndex = getFirstEnabledIndex(contents);
        const indexToPick =
          activeIndexRef.current >= 0 ? activeIndexRef.current : fallbackIndex;
        const picked = indexToPick >= 0 ? contents[indexToPick] : undefined;
        if (picked && !isItemDisabled(picked)) {
          picked.onClick?.();
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onOpenChange(false);
      }
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [
    anchorRef,
    getFirstEnabledIndex,
    getNextEnabledIndex,
    isInteractionDisabled,
    onOpenChange,
    open,
    contents,
    popoverOwnerId,
    setActiveIndex,
    setOpenSource,
  ]);

  return (
    <Dialog
      mode="popover"
      open={!isInteractionDisabled && open}
      onOpenChange={onOpenChange}
      mobileMode={mobileMode}
      sheet={{
        snapPoints: sheetConfig?.header ? [0.7, 1.0] : [0.3, 1.0],
        defaultSnap: sheetConfig?.header ? 0.7 : 0.3,
        ...sheetConfig,
        exit,
      }}
      role={role}
      popover={{
        anchorRef: anchorRef as React.RefObject<HTMLElement>,
        recalcKey: recalcKey,
        popoverOwnerId: popoverOwnerId,
        style: { padding: ".4rem" },
        stopInteractionPropagation: true,
        exit: exit,
        ...popoverConfig,
      }}
    >
      <View
        gap={popoverConfig?.gap ?? 0}
        column
        style={{
          maxHeight: isSheetMode ? "none" : "inherit",
          overflow: isSheetMode ? "visible" : "hidden",
        }}
        fullWidth
      >
        {children}
        <View
          id={listId}
          role="listbox"
          aria-labelledby={listLabelId}
          fullWidth
          style={{
            overflowY: isSheetMode ? "visible" : "auto",
            maxHeight: isSheetMode ? "none" : undefined,
          }}
          padding={isSheetMode ? [0, 6, 6, 6] : undefined}
        >
          <View
            column
            gap={2}
            padding={isSheetMode ? [6, 4] : undefined}
            themePreset={isSheetMode ? "BaseFull" : undefined}
            radius={isSheetMode ? "Regular" : undefined}
          >
            {contents.length === 0 ? (
              <Text
                type="Subheadline"
                opacity={0.6}
                style={{ padding: "0.6rem 1.6rem" }}
              >
                {t.UIKit.ui.noResults}
              </Text>
            ) : (
              contents.map((item, index) => (
                <ContextMenuOption
                  // biome-ignore lint/suspicious/noArrayIndexKey: items have stable order
                  key={`${item.value}-${index}`}
                  item={item}
                  index={index}
                  listId={listId}
                  openSource={openSource}
                  activeIndex={activeIndex}
                  isInteractionDisabled={isInteractionDisabled}
                  isOptionDisabled={isItemDisabled}
                  setOpenSource={setOpenSource}
                  setActiveIndex={setActiveIndex}
                  selectOption={item.onClick ?? (() => {})}
                  isSheetMode={isSheetMode}
                  showCheck={showCheck}
                />
              ))
            )}
          </View>
        </View>
      </View>
    </Dialog>
  );
}
