"use client";

import { useState } from "react";
import Button from "../../../Components/Button/Button";
import Icon from "../../../Components/Icon/Icon";
import Text from "../../../Components/Text/Text";
import Pressable from "../../Pressable/Pressable";
import View from "../../View/View";
import type { FunnelNavigationConfig } from "../Dialog.types";
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

  const getDefaultLocations = () => {
    if (navPreset === "oobe") {
      if (isMobile) {
        return {
          back: "header" as const,
          next: "footer" as const,
          exit: "header" as const,
        };
      }
      return {
        back: "footer" as const,
        next: "footer" as const,
        exit: "footer" as const,
      };
    }
    return {
      back: "footer" as const,
      next: "footer" as const,
      exit: "header" as const,
    };
  };

  const defaults = getDefaultLocations();
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
    setLoading(true);
    try {
      await funnel.advance();
    } finally {
      setLoading(false);
    }
  };

  const renderBack = (sizeFull = false) => {
    return (
      <Button
        text="이전"
        themePreset="UISecondary"
        sizeFull={sizeFull}
        pressable={{ onClick: () => funnel.goBack() }}
      />
    );
  };

  const renderNext = (sizeFull = false) => {
    const isSubmit = funnel.current.isLast;
    const isDisabled = loading || funnel.current.nextDisabled;

    return (
      <Button
        text={
          loading
            ? isSubmit
              ? "제출 중.."
              : "처리 중.."
            : isSubmit
              ? "제출"
              : "다음"
        }
        disabled={isDisabled}
        sizeFull={sizeFull}
        pressable={{ onClick: handleNext }}
      />
    );
  };

  const renderExit = (sizeFull = false) => {
    return (
      <Button
        text="닫기"
        themePreset="UISecondary"
        sizeFull={sizeFull}
        pressable={{ onClick: onClose }}
      />
    );
  };

  const footerButtons: { element: React.ReactNode; order: number }[] = [];
  if (locations.back === "footer" && showBack) {
    footerButtons.push({ element: renderBack(), order: 0 });
  }
  if (locations.exit === "footer" && showExit) {
    footerButtons.push({ element: renderExit(), order: 1 });
  }
  if (locations.next === "footer" && showNext) {
    footerButtons.push({ element: renderNext(), order: 2 });
  }
  footerButtons.sort((a, b) => a.order - b.order);

  const isFooterColumn = !!funnel.footer?.columnLayout;

  return (
    <View column width="100%" height="100%" style={{ overflow: "hidden" }}>
      {/* header */}
      <View
        row
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={16}
        paddingVertical={12}
        width="100%"
      >
        <View row alignItems="center" gap={8}>
          {locations.back === "header" && showBack && (
            <Icon
              icon="iArrowKeyLeft"
              box
              pressable={{ onClick: () => funnel.goBack() }}
            />
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
          {locations.exit === "header" && showExit && (
            <Icon icon="iClose" box pressable={{ onClick: onClose }} />
          )}
        </View>
      </View>

      {/* error banner */}
      {funnel.error && (
        <View paddingHorizontal={16} paddingVertical={8}>
          <Text type="Footnote" color="Red1">
            {funnel.error}
          </Text>
        </View>
      )}

      {/* content */}
      <View
        style={{
          flex: "1 1 auto",
          overflowY: "auto",
          minHeight: 0,
          padding: "1.6rem",
        }}
      >
        <funnel.Content />
      </View>

      {/* footer */}
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
                  flex: funnel.footer?.buttonCondensed ? "0 0 auto" : "1 1 0",
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
