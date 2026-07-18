"use client";

import type { ReactNode } from "react";
import Icon from "../../../Components/Icon/Icon";
import Text from "../../../Components/Text/Text";
import Pressable from "../../Pressable/Pressable";
import View from "../../View/View";
import { useDialog } from "../Dialog";
import type { DialogHeaderConfig } from "../Dialog.types";

interface DialogHeaderProps {
  config?: DialogHeaderConfig & {
    centered?: boolean;
    iconReversed?: boolean;
  };
  exitIcon?: ReactNode;
  onExit?: () => void;
  backIcon?: ReactNode;
  onBack?: () => void;
  isSheet?: boolean;
}

export default function DialogHeader({
  config,
  exitIcon,
  onExit,
  backIcon,
  onBack,
  isSheet: propIsSheet,
}: DialogHeaderProps) {
  const dialogContext = useDialog();
  const _isSheet = propIsSheet ?? dialogContext?.mode === "sheet";

  const hasContent =
    !!config?.title ||
    !!config?.caption ||
    !!config?.icon ||
    !!config?.content ||
    !!exitIcon ||
    !!backIcon;

  if (!hasContent) return null;

  const isPlainCaption =
    typeof config?.caption === "string" || typeof config?.caption === "number";

  const renderBack = () => {
    if (!backIcon) return null;
    if (backIcon === true) {
      return <Icon icon="iArrowKeyLeft" box pressable={{ onClick: onBack }} />;
    }
    return (
      <Pressable style={{ display: "contents" }} onClick={onBack}>
        {backIcon}
      </Pressable>
    );
  };

  const renderExit = () => {
    if (!exitIcon) return null;
    if (exitIcon === true) {
      return <Icon icon="iClose" box pressable={{ onClick: onExit }} />;
    }
    return (
      <Pressable style={{ display: "contents" }} onClick={onExit}>
        {exitIcon}
      </Pressable>
    );
  };

  const renderIcon = () => {
    if (!config?.icon) return null;
    return <Icon box size={20} background="Base4" {...config.icon} />;
  };

  return (
    <View
      row
      alignItems="center"
      justifyContent="space-between"
      gap={12}
      padding={4}
      width="100%"
      style={{
        position: "sticky",
        top: 0,
      }}
    >
      {config?.icon && (
        <View row alignItems="center" gap={8} order={0}>
          {renderBack()}
          {!config?.iconReversed && renderIcon()}
        </View>
      )}

      {(config?.title || config?.caption) && (
        <View
          column
          gap={2}
          order={1}
          alignItems={config?.centered ? "center" : "flex-start"}
          style={{
            flex: 1,
            minWidth: 0,
            textAlign: config?.centered ? "center" : "left",
          }}
        >
          {config?.title && (
            <Text type="Title3" lineHeight={1.45}>
              {config.title}
            </Text>
          )}
          {config?.caption && (
            <View style={{ wordBreak: "break-all" }}>
              {isPlainCaption ? (
                <Text type="Subheadline" weight={300} opacity={0.72}>
                  {config.caption}
                </Text>
              ) : (
                config.caption
              )}
            </View>
          )}
        </View>
      )}

      {config?.content}

      {exitIcon && (
        <View row alignItems="center" gap={8} order={2}>
          {config?.iconReversed && renderIcon()}
          {renderExit()}
        </View>
      )}
    </View>
  );
}
