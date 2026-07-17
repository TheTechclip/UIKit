"use client";

import Icon from "@/packages/Components/Icon/Icon";
import type { ImageProps } from "@/packages/Frameworks/View/ImageView/Image.types";
import View from "@/packages/Frameworks/View/View";

export interface DialogImageHeaderProps {
  config?: NonNullable<ImageProps["dialog"]>["header"];
  onClose: () => void;
}

export function DialogImageHeader({ config, onClose }: DialogImageHeaderProps) {
  return (
    <View
      justifyContent="space-between"
      alignItems="center"
      className={config?.className}
      style={{
        position: "absolute",
        top: "1.6rem",
        left: "1.6rem",
        right: "1.6rem",
        zIndex: 2,
        pointerEvents: "none",
        ...config?.style,
      }}
    >
      {config?.content && (
        <View style={{ pointerEvents: "auto" }}>{config.content}</View>
      )}
      <Icon
        data-color-mode="dark"
        icon="iClose"
        shadow="Regular"
        box
        size={18}
        themePreset="BaseSoft"
        backgroundBlur="ExtraLight"
        boxOptions={{
          padding: 6,
        }}
        pressable={{
          onClick: onClose,
          style: { pointerEvents: "auto", marginLeft: "auto" },
        }}
      />
    </View>
  );
}
