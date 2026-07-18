"use client";

import { getFloatingTransformOrigin } from "@musecat/functionkit";
import { AnimatePresence } from "motion/react";
import { type ReactNode, useCallback, useEffect, useRef } from "react";
import { useScrollLock } from "../../_shared/bodyScrollLock";
import { LAYER_Z_INDEX } from "../../_shared/layer.constants";
import { Size } from "../../_shared/sizing";
import { motionPresets } from "../../Motion/Motion.presets";
import View from "../../View/View";
import DialogFooter from "../contents/Dialog.footer";
import DialogHeader from "../contents/Dialog.header";
import BackgroundWrapper from "../Dialog.background";
import type { DialogOutsideOptions, PopoverConfig } from "../Dialog.types";
import { DialogPortal, useEscapeClose } from "../Dialog.utils";
import { useDialogPosition } from "../hooks/useDialogPosition";

interface RenderPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: PopoverConfig;
  id?: string;
  zIndex?: number;
  width?: string | number;
  height?: string | number;
  children: ReactNode;
  role?: string;
  "data-color-mode"?: string;
}

export default function RenderPopover({
  open,
  onOpenChange,
  config,
  id,
  zIndex,
  width,
  height,
  children,
  role = "dialog",
  "data-color-mode": dataColorMode,
}: RenderPopoverProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayEnabled = config.exit?.overlay !== false;

  const {
    topValue,
    leftValue,
    maxHeightValue,
    resolvedPlacement,
    computedWidth,
    isPositionReady,
  } = useDialogPosition({
    open,
    anchorRef: config.anchorRef,
    contentRef,
    placement: config.placement,
    strategy: config.strategy,
    selectedItemSelector: config.selectedItemSelector,
    matchAnchorWidth: config.matchAnchorWidth,
    coverAnchor: config.coverAnchor,
    margin: config.margin,
    recalcKey: config.recalcKey,
    offset: config.offset,
  });

  const resolvedZIndex = zIndex ?? LAYER_Z_INDEX.popover;

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const stopPropagation = useCallback((e: React.SyntheticEvent) => {
    e.stopPropagation();
  }, []);

  const propagationHandlers = config.stopInteractionPropagation
    ? {
        onClick: stopPropagation,
        onMouseDown: stopPropagation,
        onMouseUp: stopPropagation,
        onTouchStart: stopPropagation,
        onTouchEnd: stopPropagation,
        onPointerDown: stopPropagation,
        onPointerUp: stopPropagation,
        onKeyDown: stopPropagation,
        onKeyUp: stopPropagation,
      }
    : {};

  useEscapeClose(open && config.exit?.escape !== false, close);

  const offsetWidth = config.offset?.width;
  const resolvedWidth = (() => {
    if (offsetWidth === undefined || offsetWidth === null) {
      return computedWidth !== null ? `${computedWidth}px` : Size(width);
    }
    const add =
      typeof offsetWidth === "number" ? `${offsetWidth}px` : offsetWidth;
    if (computedWidth !== null) return `calc(${computedWidth}px + ${add})`;
    const base = width != null ? Size(width) : "auto";
    return `calc(${base} + ${add})`;
  })();

  useEffect(() => {
    if (!open || !overlayEnabled) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (contentRef.current?.contains(target)) return;
      if (config.anchorRef.current?.contains(target)) return;

      const triggerLabel = config.anchorRef.current?.closest("label");
      if (triggerLabel?.contains(target)) return;
      close();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, overlayEnabled, close, config.anchorRef]);

  const isOutsideConfig =
    config.outside !== undefined && config.outside !== false;
  const outsideOptions: DialogOutsideOptions =
    isOutsideConfig && typeof config.outside === "object" ? config.outside : {};
  const lockScroll = outsideOptions.lockBodyScroll ?? false;

  useScrollLock(open && lockScroll);

  const popoverNode = (
    <AnimatePresence>
      {open ? (
        <View
          data-color-mode={dataColorMode}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: resolvedZIndex,
            pointerEvents: "none",
          }}
        >
          {isOutsideConfig && (
            <BackgroundWrapper
              open={open}
              showBackdrop={isOutsideConfig}
              background={outsideOptions.background}
              backgroundBlur={outsideOptions.backgroundBlur}
              className={outsideOptions.className}
              style={outsideOptions.style}
              zIndex={resolvedZIndex - 1}
              onClick={overlayEnabled ? close : undefined}
            />
          )}
          <View
            id={id}
            ref={contentRef}
            className={config.className}
            role={role}
            tabIndex={-1}
            data-popover-owner={config.popoverOwnerId}
            {...propagationHandlers}
            motion={motionPresets.popover(isPositionReady)}
            themePreset={config.themePreset}
            background={config.background ?? "Base1TP1"}
            color={config.color}
            border={config.border}
            radius={config.radius ?? "Light"}
            shadow={config.shadow ?? "Regular"}
            gap={config.gap ?? 0}
            backgroundBlur={config.backgroundBlur ?? "Light"}
            width={width}
            height={height}
            column
            style={{
              position: "absolute",
              zIndex: resolvedZIndex,
              top: topValue ?? 0,
              left: leftValue ?? 0,
              width: resolvedWidth,
              height: Size(height),
              maxHeight: config.maxHeight
                ? Size(config.maxHeight)
                : `${maxHeightValue}px`,
              visibility: isPositionReady ? "visible" : "hidden",
              pointerEvents: isPositionReady ? "auto" : "none",
              transformOrigin: getFloatingTransformOrigin(
                resolvedPlacement as any,
              ),
              overflow: "hidden",
              willChange: "transform",
              ...config.style,
            }}
          >
            <DialogHeader
              config={config.header}
              exitIcon={config.exit?.icon}
              onExit={close}
            />

            {children}

            <View style={{ display: "contents" }}>
              <DialogFooter
                config={config.footer}
                exitButton={config.exit?.footerButton}
                onExit={close}
              />
            </View>
          </View>
        </View>
      ) : null}
    </AnimatePresence>
  );

  return <DialogPortal>{popoverNode}</DialogPortal>;
}
