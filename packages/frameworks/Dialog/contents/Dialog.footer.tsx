"use client";

import type { ReactNode } from "react";
import Button from "../../../components/Button/Button";
import Pressable from "../../Pressable/Pressable";
import View from "../../View/View";
import type { DialogFooterConfig } from "../Dialog.types";

interface DialogFooterProps {
  config?: DialogFooterConfig;
  exitButton?: ReactNode;
  onExit?: () => void;
}

export default function DialogFooter({
  config,
  exitButton,
  onExit,
}: DialogFooterProps) {
  if (!config && !exitButton) return null;

  const renderExitButton = () => {
    if (!exitButton) return null;
    if (exitButton === true) {
      return (
        <Button
          text="닫기"
          themePreset="UISecondary"
          pressable={{ onClick: onExit }}
          style={{ flex: config?.buttonCondensed ? "0 0 auto" : "1 1 0" }}
        />
      );
    }
    return (
      <Pressable style={{ display: "contents" }} onClick={onExit}>
        {exitButton}
      </Pressable>
    );
  };

  const isColumn = !!config?.columnLayout;

  return (
    <View
      row={!isColumn}
      column={isColumn}
      alignItems={isColumn ? "stretch" : "center"}
      gap={12}
      padding={4}
      width="100%"
    >
      {config?.content && (
        <View style={{ flex: "1 1 auto", minWidth: 0 }}>{config.content}</View>
      )}

      {(config?.buttons?.length || exitButton) && (
        <View
          row={!isColumn}
          column={isColumn}
          gap={8}
          justifyContent="flex-end"
          style={{ flex: "1 1 auto" }}
        >
          {renderExitButton()}
          {config?.buttons?.map(({ key, ...button }) => (
            <Button
              key={key ?? String(button.text)}
              {...button}
              style={{
                flex: config?.buttonCondensed ? "0 0 auto" : "1 1 0",
                ...button.style,
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
