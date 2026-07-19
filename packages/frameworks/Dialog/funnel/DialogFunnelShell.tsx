"use client";

import { useState } from "react";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import Text from "../../../components/Text/Text";
import Pressable from "../../Pressable/Pressable";
import View from "../../View/View";
import type {
  FunnelNavigationAction,
  FunnelNavigationConfig,
} from "../Dialog.types";
import type { DialogFunnelProp } from "./DialogFunnel.types";

interface DialogFunnelShellProps {
  funnel: DialogFunnelProp;
  onClose: () => void;
  isMobile: boolean;
}

type ButtonLocation = "header" | "footer";

function resolveLocation(
  key: "backLocation" | "nextLocation" | "exitLocation",
  nav: FunnelNavigationConfig | undefined,
  fallback: ButtonLocation,
  isMobile: boolean,
): ButtonLocation {
  const loc = nav?.[key];
  if (typeof loc === "object") {
    return isMobile ? (loc.mobile ?? fallback) : (loc.pc ?? fallback);
  }
  return loc ?? fallback;
}

export default function DialogFunnelShell({
  funnel,
  onClose,
  isMobile,
}: DialogFunnelShellProps) {
  const [loading, setLoading] = useState(false);
  const navPreset = funnel.preset ?? "oobe";
  const defaults =
    navPreset === "oobe"
      ? isMobile
        ? {
            back: "header" as const,
            next: "footer" as const,
            exit: "header" as const,
          }
        : {
            back: "footer" as const,
            next: "footer" as const,
            exit: "footer" as const,
          }
      : {
          back: "footer" as const,
          next: "footer" as const,
          exit: "header" as const,
        };
  const nav = funnel.navigation;
  const locations = {
    back: resolveLocation("backLocation", nav, defaults.back, isMobile),
    next: resolveLocation("nextLocation", nav, defaults.next, isMobile),
    exit: resolveLocation("exitLocation", nav, defaults.exit, isMobile),
  };
  const showBack = !funnel.current.isFirst && nav?.back !== false;
  const showNext = nav?.next !== false;
  const showExit = nav?.exit !== false;

  const handleNext = async () => {
    if (loading || funnel.loading || funnel.current.nextDisabled) return;
    setLoading(true);
    try {
      await funnel.advance();
    } finally {
      setLoading(false);
    }
  };

  const renderBack = (sizeFull = false) => (
    <Button
      text="이전"
      themePreset="UISecondary"
      sizeFull={sizeFull}
      pressable={{ onClick: () => funnel.goBack() }}
    />
  );
  const renderNext = (sizeFull = false) => {
    const isSubmit = funnel.current.isLast;
    const isBusy = loading || funnel.loading;
    return (
      <Button
        text={
          isBusy
            ? isSubmit
              ? "제출 중.."
              : "처리 중.."
            : isSubmit
              ? "제출"
              : "다음"
        }
        sizeFull={sizeFull}
        pressable={{
          onClick: handleNext,
          disabled: isBusy || funnel.current.nextDisabled,
        }}
      />
    );
  };
  const renderExit = (sizeFull = false) => (
    <Button
      text="닫기"
      themePreset="UISecondary"
      sizeFull={sizeFull}
      pressable={{ onClick: onClose }}
    />
  );

  const renderNavigation = (
    action: FunnelNavigationAction | undefined,
    fallback: (sizeFull?: boolean) => React.ReactNode,
    control: { onClick: () => void; disabled?: boolean },
  ) => {
    if (typeof action === "function") return action(control);
    return fallback();
  };

  const footerButtons: { element: React.ReactNode; order: number }[] = [];
  if (locations.back === "footer" && showBack)
    footerButtons.push({
      element: renderNavigation(nav?.back, renderBack, {
        onClick: funnel.goBack,
      }),
      order: 0,
    });
  if (locations.exit === "footer" && showExit)
    footerButtons.push({
      element: renderNavigation(nav?.exit, renderExit, { onClick: onClose }),
      order: 1,
    });
  if (locations.next === "footer" && showNext)
    footerButtons.push({
      element: renderNavigation(nav?.next, renderNext, {
        onClick: handleNext,
        disabled: loading || funnel.loading || funnel.current.nextDisabled,
      }),
      order: 2,
    });
  footerButtons.sort((a, b) => a.order - b.order);
  const isFooterColumn = !!funnel.footer?.columnLayout;
  const isButtonCondensed =
    funnel.footer?.buttonCondensed === true ||
    (funnel.footer?.buttonCondensed === "pc" && !isMobile);

  return (
    <View column width="100%" height="100%" style={{ overflow: "hidden" }}>
      <View
        row
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={16}
        paddingVertical={12}
        width="100%"
      >
        <View row alignItems="center" gap={8}>
          {locations.back === "header" &&
            showBack &&
            renderNavigation(
              nav?.back,
              () => (
                <Icon
                  icon="iArrowKeyLeft"
                  box
                  pressable={{ onClick: funnel.goBack }}
                />
              ),
              { onClick: funnel.goBack },
            )}
          {funnel.current.meta.icon && (
            <Icon box size={20} {...funnel.current.meta.icon} />
          )}
          <View column gap={2}>
            {funnel.current.meta.title && (
              <Text type="Headline">{funnel.current.meta.title}</Text>
            )}
            {funnel.current.meta.caption && (
              <Text type="Footnote" opacity={0.72}>
                {funnel.current.meta.caption}
              </Text>
            )}
          </View>
        </View>
        <View row alignItems="center">
          {locations.exit === "header" &&
            showExit &&
            renderNavigation(
              nav?.exit,
              () => <Icon icon="iClose" box pressable={{ onClick: onClose }} />,
              { onClick: onClose },
            )}
        </View>
      </View>
      {funnel.error && (
        <View paddingHorizontal={16} paddingVertical={8}>
          <Text type="Footnote" color="Red1">
            {funnel.error}
          </Text>
        </View>
      )}
      <View
        padding={16}
        style={{ flex: "1 1 auto", overflowY: "auto", minHeight: 0 }}
      >
        <funnel.Content />
      </View>
      {footerButtons.length > 0 && (
        <View
          row={!isFooterColumn}
          column={isFooterColumn}
          alignItems={isFooterColumn ? "stretch" : "center"}
          gap={12}
          paddingHorizontal={16}
          paddingVertical={16}
          width="100%"
        >
          <View
            row={!isFooterColumn}
            column={isFooterColumn}
            gap={8}
            justifyContent="flex-end"
            style={{ flex: "1 1 auto" }}
          >
            {footerButtons.map((btn) => (
              <Pressable
                key={btn.order}
                style={{
                  display: "contents",
                  flex: isButtonCondensed ? "0 0 auto" : "1 1 0",
                }}
              >
                {btn.element}
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
