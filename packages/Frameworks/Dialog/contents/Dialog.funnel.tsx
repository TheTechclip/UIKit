"use client";

import { useMemo, useState } from "react";
import Button from "../../../Components/Button/Button";
import Icon from "../../../Components/Icon/Icon";
import Text from "../../../Components/Text/Text";
import type {
  FunnelConfig,
  FunnelHistory,
  FunnelStepConfig,
} from "../Dialog.types";
import Pressable from "../../Pressable/Pressable";
import View from "../../View/View";

interface DialogFunnelProps {
  config: FunnelConfig;
  onClose: () => void;
  isMobile: boolean;
}

export default function DialogFunnel({
  config,
  onClose,
  isMobile,
}: DialogFunnelProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const currentStep = config.steps[stepIndex] as FunnelStepConfig | undefined;

  const history = useMemo<FunnelHistory>(() => {
    return {
      push: (step: string) => {
        const nextIdx = config.steps.findIndex((s) => s.name === step);
        if (nextIdx >= 0) setStepIndex(nextIdx);
      },
      replace: (step: string) => {
        const nextIdx = config.steps.findIndex((s) => s.name === step);
        if (nextIdx >= 0) setStepIndex(nextIdx);
      },
      back: () => {
        if (stepIndex > 0) setStepIndex(stepIndex - 1);
      },
      go: (index: number) => {
        if (index >= 0 && index < config.steps.length) setStepIndex(index);
      },
    };
  }, [config.steps, stepIndex]);

  useMemo(() => {
    config.onMount?.(history);
  }, [config.onMount, history]);

  if (!currentStep) return null;

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === config.steps.length - 1;

  const navPreset = config.preset ?? "oobe";

  const getButtonLocations = () => {
    let backLoc: "header" | "footer" = "footer";
    let nextLoc: "header" | "footer" = "footer";
    let exitLoc: "header" | "footer" = "header";

    if (navPreset === "oobe") {
      if (isMobile) {
        backLoc = "header";
      } else {
        backLoc = "footer";
        nextLoc = "footer";
        exitLoc = "footer";
      }
    }

    const resolveLocation = (
      key: "backLocation" | "nextLocation" | "exitLocation",
      fallback: "header" | "footer",
    ) => {
      const loc = config.navigation?.[key];
      if (typeof loc === "object") {
        return isMobile ? loc.mobile : loc.pc;
      }
      return loc ?? fallback;
    };

    return {
      back: resolveLocation("backLocation", backLoc),
      next: resolveLocation("nextLocation", nextLoc),
      exit: resolveLocation("exitLocation", exitLoc),
    };
  };

  const locations = getButtonLocations();

  const handleNext = async () => {
    if (currentStep.onNext) {
      const result = await currentStep.onNext();
      if (result === false) return;
      if (typeof result === "string") {
        history.push(result);
        return;
      }
    }
    if (!isLastStep) {
      setStepIndex(stepIndex + 1);
    } else {
      config.onFinish?.();
    }
  };

  const showBack = !isFirstStep && config.navigation?.back !== false;
  const showNext = config.navigation?.next !== false;
  const showExit = config.navigation?.exit !== false;

  const renderBackButton = (sizeFull = false) => {
    if (!showBack) return null;
    return (
      <Button
        text="이전"
        themePreset="UISecondary"
        sizeFull={sizeFull}
        pressable={{ onClick: () => history.back() }}
      />
    );
  };

  const renderNextButton = (sizeFull = false) => {
    if (!showNext) return null;
    const isSubmit = isLastStep;
    return (
      <Button
        text={isSubmit ? (config.loading ? "제출 중.." : "제출") : "다음"}
        disabled={currentStep.nextDisabled || config.loading}
        sizeFull={sizeFull}
        pressable={{ onClick: handleNext }}
      />
    );
  };

  const renderExitButton = (sizeFull = false) => {
    if (!showExit) return null;
    return (
      <Button
        text="닫기"
        themePreset="UISecondary"
        sizeFull={sizeFull}
        pressable={{ onClick: onClose }}
      />
    );
  };

  const footerButtons = [];
  if (locations.back === "footer") {
    const btn = renderBackButton();
    if (btn) footerButtons.push({ element: btn, order: 0 });
  }
  if (locations.exit === "footer") {
    const btn = renderExitButton();
    if (btn) footerButtons.push({ element: btn, order: 1 });
  }
  if (locations.next === "footer") {
    const btn = renderNextButton();
    if (btn) footerButtons.push({ element: btn, order: 2 });
  }

  const sortedButtons = [...footerButtons].sort((a, b) => {
    return a.order - b.order;
  });

  const isFooterColumn = !!config.footer?.columnLayout;

  return (
    <View column width="100%" height="100%" style={{ overflow: "hidden" }}>
      {}
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
              pressable={{ onClick: () => history.back() }}
            />
          )}
          {currentStep.icon && <Icon box size={20} {...currentStep.icon} />}
          <View column gap={2}>
            {currentStep.title && (
              <Text type="Headline">{currentStep.title}</Text>
            )}
            {currentStep.caption && (
              <Text type="Footnote" opacity={0.72}>
                {currentStep.caption}
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

      {}
      <View
        style={{
          flex: "1 1 auto",
          overflowY: "auto",
          minHeight: 0,
          padding: "1.6rem",
        }}
      >
        {currentStep.content}
      </View>

      {}
      {(sortedButtons.length > 0 || config.footer?.content) && (
        <View
          row={!isFooterColumn}
          column={isFooterColumn}
          alignItems={isFooterColumn ? "stretch" : "center"}
          gap={12}
          paddingHorizontal={16}
          paddingVertical={16}
          width="100%"
        >
          {config.footer?.content && (
            <View style={{ flex: "1 1 auto", minWidth: 0 }}>
              {config.footer.content}
            </View>
          )}
          <View
            row={!isFooterColumn}
            column={isFooterColumn}
            gap={8}
            justifyContent="flex-end"
            style={{ flex: "1 1 auto" }}
          >
            {sortedButtons.map((btn) => (
              <Pressable
                key={btn.order}
                style={{
                  display: "contents",
                  flex: config.footer?.buttonCondensed ? "0 0 auto" : "1 1 0",
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
