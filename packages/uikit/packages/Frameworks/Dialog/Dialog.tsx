"use client";

import { buildContext, useViewportMatch } from "@musecat/functionkit";
import { useMemo } from "react";
import DialogFunnelShell from "./funnel/DialogFunnelShell";
import type {
  DialogContextValue,
  DialogMode,
  DialogProps,
} from "./Dialog.types";
import RenderModal from "./renderers/renderModal";
import RenderPopover from "./renderers/renderPopover";
import RenderSheet from "./renderers/renderSheet";

const [DialogProvider, useRawDialogContext] =
  buildContext<DialogContextValue | null>(null);

export function useDialog() {
  return useRawDialogContext();
}

export default function Dialog(props: DialogProps) {
  const {
    open = false,
    onOpenChange = () => {},
    zIndex,
    id,
    width,
    height,
    mode,
    mobileMode,
    role,
    popover,
    modal,
    sheet,
    funnel,
    exit,
    children,
    content,
    "data-color-mode": dataColorMode,
  } = props;

  const resolvedChildren = children ?? content;

  const isMobile = useViewportMatch("(max-width: 549.98px)");

  const resolvedMode = useMemo<DialogMode>(() => {
    if (mode === "sheet") return "sheet";
    if (isMobile && mobileMode) {
      return mobileMode;
    }
    return mode;
  }, [mode, isMobile, mobileMode]);

  const resolvedHeader = useMemo(() => {
    if (funnel) return undefined;
    if (resolvedMode === "popover") return popover?.header;
    if (resolvedMode === "modal") return modal?.header ?? popover?.header;
    return sheet?.header ?? popover?.header;
  }, [resolvedMode, popover, modal, sheet, funnel]);

  const resolvedFooter = useMemo(() => {
    if (funnel) return undefined;
    if (resolvedMode === "popover") return popover?.footer;
    if (resolvedMode === "modal") return modal?.footer ?? popover?.footer;
    return sheet?.footer ?? popover?.footer;
  }, [resolvedMode, popover, modal, sheet, funnel]);

  const resolvedExit = useMemo(() => {
    if (funnel) return undefined;
    if (resolvedMode === "popover") return popover?.exit ?? exit;
    if (resolvedMode === "modal") return modal?.exit ?? popover?.exit ?? exit;
    return sheet?.exit ?? popover?.exit ?? exit;
  }, [resolvedMode, popover, modal, sheet, funnel, exit]);

  const close = () => {
    onOpenChange(false);
  };

  const contextValue = useMemo<DialogContextValue>(
    () => ({
      id: id || "",
      mode: resolvedMode,
      open,
      closeDialog: close,
    }),
    // biome-ignore lint/correctness/useExhaustiveDependencies: close is intentionally a stable reference
    [id, resolvedMode, open, close],
  );

  const renderFunnelContent = () => {
    if (!funnel) return null;
    return <DialogFunnelShell funnel={funnel} onClose={close} isMobile={isMobile} />;
  };

  const renderContent = () => {
    if (resolvedMode === "popover" && popover) {
      const popoverConfig = {
        ...popover,
        header: resolvedHeader,
        footer: resolvedFooter,
        exit: resolvedExit,
      };

      return (
        <RenderPopover
          open={open}
          onOpenChange={onOpenChange}
          config={popoverConfig}
          id={id}
          zIndex={zIndex}
          width={width}
          height={height}
          role={role}
          data-color-mode={dataColorMode}
        >
          {resolvedChildren}
        </RenderPopover>
      );
    }

    if (resolvedMode === "modal") {
      const modalConfig = funnel
        ? {
            ...modal,
            custom: renderFunnelContent(),
            popoverOwnerId: popover?.popoverOwnerId,
          }
        : {
            ...modal,
            header: resolvedHeader,
            footer: resolvedFooter,
            exit: resolvedExit,
            popoverOwnerId: popover?.popoverOwnerId,
          };

      return (
        <RenderModal
          open={open}
          onOpenChange={onOpenChange}
          config={modalConfig}
          id={id}
          zIndex={zIndex}
          width={width}
          height={height}
          role={role}
          data-color-mode={dataColorMode}
        >
          {resolvedChildren}
        </RenderModal>
      );
    }

    if (resolvedMode === "sheet") {
      const sheetConfig = {
        ...sheet,
        header: resolvedHeader,
        footer: resolvedFooter,
        exit: resolvedExit,
        popoverOwnerId: popover?.popoverOwnerId,
      };

      return (
        <RenderSheet
          open={open}
          onOpenChange={onOpenChange}
          config={sheetConfig}
          id={id}
          zIndex={zIndex}
          width={width}
          height={height}
          role={role}
          data-color-mode={dataColorMode}
        >
          {funnel ? renderFunnelContent() : resolvedChildren}
        </RenderSheet>
      );
    }

    return null;
  };

  return (
    <DialogProvider value={contextValue}>{renderContent()}</DialogProvider>
  );
}
