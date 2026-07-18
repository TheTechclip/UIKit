"use client";

import { useTimeout } from "@musecat/functionkit";
import { useEffect, useState } from "react";
import { Word } from "../../../i18n/shared";
import type { PressableProps } from "../../Frameworks/Pressable/Pressable.types";
import View from "../../Frameworks/View/View";
import Icon from "../Icon/Icon";
import type { IconProps } from "../Icon/Icon.types";
import Text from "../Text/Text";
import type { PaginationProps } from "./Pagination.types";

function clampPage(page: number, total: number) {
  return Math.min(total, Math.max(1, page));
}

const INPUT_COMMIT_DELAY_MS = 350;

export default function Pagination({
  page,
  total,
  onChange,
  disabled = false,
  previousLabel,
  nextLabel,
  navigationLabel,
  getPageLabel,
  className,
  style,
  themePreset,
  background,
  color,
  themeInteractive,
  border,
  "data-color-mode": dataTheme,
}: PaginationProps) {
  const t = Word();
  const safeTotal = Math.max(1, Math.trunc(total) || 1);
  const safePage = clampPage(Math.trunc(page) || 1, safeTotal);
  const resolvedPreviousLabel = previousLabel ?? t.UIKit.ui.previous;
  const resolvedNextLabel = nextLabel ?? t.UIKit.ui.next;
  const resolvedNavigationLabel = navigationLabel ?? t.UIKit.ui.pagination;
  const resolvedGetPageLabel =
    getPageLabel ??
    ((value: number, isCurrent: boolean) =>
      isCurrent
        ? t.UIKit.ui.currentPage.replace("{value}", String(value))
        : t.UIKit.ui.goToPageItem.replace("{value}", String(value)));
  const firstPageLabel = resolvedGetPageLabel(1, safePage === 1);
  const lastPageLabel = resolvedGetPageLabel(safeTotal, safePage === safeTotal);
  const [inputValue, setInputValue] = useState(String(safePage));
  const inputWidth = `${Math.max(inputValue.length, 1)}ch`;
  const handleChange = (nextPage: number) => {
    if (disabled) return;

    const resolvedPage = clampPage(nextPage, safeTotal);
    if (resolvedPage === safePage) return;
    onChange?.(resolvedPage);
  };

  const inputCommitTimer = useTimeout(
    () => {
      const nextPage = Number.parseInt(inputValue, 10);
      if (Number.isFinite(nextPage)) {
        handleChange(nextPage);
      }
    },
    INPUT_COMMIT_DELAY_MS,
    { enabled: false },
  );

  useEffect(() => {
    setInputValue(String(safePage));
  }, [safePage]);

  useEffect(() => inputCommitTimer.clear, [inputCommitTimer]);

  const commitInputValue = () => {
    inputCommitTimer.clear();

    const nextPage = Number.parseInt(inputValue, 10);
    if (!Number.isFinite(nextPage)) {
      setInputValue(String(safePage));
      return;
    }
    const resolvedPage = clampPage(nextPage, safeTotal);
    setInputValue(String(resolvedPage));
    handleChange(resolvedPage);
  };

  const scheduleInputCommit = (nextValue: string) => {
    inputCommitTimer.clear();
    if (disabled || !nextValue || nextValue === String(safePage)) return;

    inputCommitTimer.start(INPUT_COMMIT_DELAY_MS);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value.replace(/\D/g, "");
    if (!nextValue) {
      setInputValue("");
      inputCommitTimer.clear();
      return;
    }

    const nextPage = Number.parseInt(nextValue, 10);
    const resolvedValue = String(Math.min(nextPage, safeTotal));
    setInputValue(resolvedValue);
    scheduleInputCommit(resolvedValue);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      commitInputValue();
      event.currentTarget.blur();
    }
  };

  function IconRender({
    icon,
    pressable,
  }: {
    icon: IconProps["icon"];
    pressable: PressableProps;
  }) {
    return (
      <Icon
        box
        boxOptions={{ padding: 12 }}
        icon={icon}
        themePreset={themePreset ?? "UIPrimary"}
        background={background}
        color={color}
        border={border}
        themeInteractive={themeInteractive}
        pressable={pressable}
      />
    );
  }

  return (
    // biome-ignore lint/a11y/useSemanticElements: nav[role="group"] is correct for pagination
    <nav
      aria-label={resolvedNavigationLabel}
      data-color-mode={dataTheme}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.2rem",
        width: "100%",
        ...style,
      }}
      role="group"
    >
      <IconRender
        icon="iArrowKeyDoubleLeft"
        pressable={{
          onClick: () => handleChange(1),
          disabled: disabled || safePage <= 1,
          title: firstPageLabel,
          "aria-label": firstPageLabel,
        }}
      />
      <IconRender
        icon="iArrowKeyLeft"
        pressable={{
          onClick: () => handleChange(safePage - 1),
          disabled: disabled || safePage <= 1,
          title: resolvedPreviousLabel,
          "aria-label": resolvedPreviousLabel,
        }}
      />
      <fieldset
        style={{
          width: "100%",
          height: "100%",
          border: 0,
          marginInline: 0,
          padding: 0,
          minInlineSize: 0,
        }}
        aria-label={t.UIKit.ui.goToPage}
      >
        <label style={{ width: "100%", height: "100%" }}>
          <View
            themePreset={themePreset ?? "UIPrimary"}
            border={border}
            radius="Circle"
            alignItems="center"
            justifyContent="center"
            gap={12}
            height="100%"
            padding={[15, 8]}
            fullWidth
          >
            <View alignItems="center" gap={0}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={inputValue}
                disabled={disabled}
                role="spinbutton"
                aria-label={t.UIKit.ui.goToPage}
                aria-valuemin={1}
                aria-valuemax={safeTotal}
                aria-valuenow={safePage}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                style={
                  {
                    "--pagination-input-width": inputWidth,
                    textAlign: "center",
                    fontSize: "var(--font-headline-size)",
                    width: "calc(var(--pagination-input-width, 1ch) + 1.6rem)",
                    minWidth: "3.4rem",
                    maxWidth: "12rem",
                  } as React.CSSProperties
                }
              />
              <Text type="Headline" verticalTrim opacity={0.2} aria-hidden>
                /
              </Text>
            </View>
            <Text
              type="Headline"
              verticalTrim
              opacity={0.4}
              aria-label={lastPageLabel}
            >
              {safeTotal}
            </Text>
          </View>
        </label>
      </fieldset>
      <IconRender
        icon="iArrowKeyRight"
        pressable={{
          onClick: () => handleChange(safePage + 1),
          disabled: disabled || safePage >= safeTotal,
          title: resolvedNextLabel,
          "aria-label": resolvedNextLabel,
        }}
      />
      <IconRender
        icon="iArrowKeyDoubleRight"
        pressable={{
          onClick: () => handleChange(safeTotal),
          disabled: disabled || safePage >= safeTotal,
          title: lastPageLabel,
          "aria-label": lastPageLabel,
        }}
      />
    </nav>
  );
}
