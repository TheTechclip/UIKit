"use client";

import {
  animate,
  useDragControls,
  useMotionValue,
  useTransform,
} from "motion/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useScrollLock } from "../../_shared/bodyScrollLock";
import { LAYER_Z_INDEX } from "../../_shared/layer.constants";
import { Size } from "../../_shared/sizing";
import DialogFooter from "../contents/Dialog.footer";
import DialogHeader from "../contents/Dialog.header";
import BackgroundWrapper from "../Dialog.background";
import type {
  DialogOutsideOptions,
  SheetConfig,
} from "../Dialog.types";
import {
  DialogPortal,
  useEscapeClose,
} from "../Dialog.utils";
import { useSheetDrag } from "../hooks/useSheetDrag";
import { resolveInitialSnapIndex } from "../hooks/useSheetGeometry";
import { useSheetGeometry } from "../hooks/useSheetGeometry";
import { useSheetProgressive } from "../hooks/useSheetProgressive";
import { motionTransitions } from "../../Motion/Motion.presets";
import Pressable from "../../Pressable/Pressable";
import View from "../../View/View";

interface RenderSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: SheetConfig;
  id?: string;
  zIndex?: number;
  width?: string | number;
  height?: string | number;
  children?: ReactNode;
  role?: string;
  "data-color-mode"?: string;
}

const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default function RenderSheet({
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
}: RenderSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [sheetHeightPx, setSheetHeightPx] = useState(0);
  const entranceFrameRef = useRef<number | null>(null);
  const entranceControlsRef = useRef<{ stop: () => void } | null>(null);
  const isClosingRef = useRef(false);
  const openRef = useRef(open);
  openRef.current = open;
  const openValue = useMotionValue(0);

  const {
    viewportHeight,
    getViewportHeight,
    minPx,
    maxPx,
    maxSnap,
    normalizedSnapPoints,
    resolvedFreeDragHeightPx,
    getTargetYForSnap,
    getGapHiddenY,
    isFreeDrag,
    isMinDefault,
  } = useSheetGeometry({ config, height, sheetHeightPx, open, rendered });

  const resolveSnap = useCallback(
    () => resolveInitialSnapIndex(normalizedSnapPoints, config?.defaultSnap),
    [normalizedSnapPoints, config?.defaultSnap],
  );
  const [snapIndex, setSnapIndex] = useState(resolveSnap);
  const currentSnap =
    normalizedSnapPoints[snapIndex] ?? normalizedSnapPoints.at(-1) ?? 1;

  useEffect(() => {
    if (isFreeDrag) return;
    setSnapIndex(resolveSnap());
  }, [isFreeDrag, resolveSnap]);

  const { inset, bottomGap, radiusArr } = useSheetProgressive({
    y,
    normalizedSnapPoints,
    viewportHeight,
    maxSnap,
    isFreeDrag,
    hasExplicitSnapPoints: !!config?.snapPoints?.length,
  });

  const backdropOpacity = useMotionValue(1);

  useEffect(() => {
    const updateOpacity = (latestY: number) => {
      if (isFreeDrag) return;
      const h =
        (sheetRef.current?.offsetHeight ?? sheetHeightPx ?? viewportHeight) ||
        800;
      const restY = getTargetYForSnap(currentSnap);
      const maxY = Math.max(100, h);
      const relativeY = Math.max(0, latestY - restY);
      const ratio = Math.min(1, relativeY / maxY);
      backdropOpacity.set(0.1 + 0.9 * (1 - ratio));
    };
    updateOpacity(y.get());
    return y.on("change", updateOpacity);
  }, [
    y,
    viewportHeight,
    isFreeDrag,
    currentSnap,
    getTargetYForSnap,
    sheetHeightPx,
    backdropOpacity,
  ]);

  const overlayOpacity = useTransform(
    [backdropOpacity, openValue],
    ([latestBackdrop, latestOpen]: number[]) => latestBackdrop * latestOpen,
  );

  const resolvedZIndex = zIndex ?? LAYER_Z_INDEX.modal;

  const sheetHeight =
    height ??
    (config?.snapPoints?.length ? `${maxSnap * 100}vh` : "max-content");
  const dragEnabled = !(config?.disableDrag ?? false);
  const isOutsideConfig = config?.outside !== false;
  const outsideOptions: DialogOutsideOptions =
    config?.outside && typeof config.outside === "object" ? config.outside : {};
  const lockBodyScroll = outsideOptions.lockBodyScroll !== false;

  useScrollLock(open && lockBodyScroll);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) setRendered(true);
  }, [open]);

  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    const update = () => setSheetHeightPx(el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cancelEntranceAnimation = useCallback(() => {
    if (entranceFrameRef.current !== null) {
      cancelAnimationFrame(entranceFrameRef.current);
      entranceFrameRef.current = null;
    }
    entranceControlsRef.current?.stop();
    entranceControlsRef.current = null;
  }, []);

  const exitControlsRef = useRef<{ stop: () => void } | null>(null);
  const exitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelExitAnimation = useCallback(() => {
    if (exitTimeoutRef.current !== null) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }
    exitControlsRef.current?.stop();
    exitControlsRef.current = null;
  }, []);

  const getGapHiddenYCurried = useCallback(
    () => getGapHiddenY(currentSnap, isFreeDrag, getTargetYForSnap),
    [getGapHiddenY, currentSnap, isFreeDrag, getTargetYForSnap],
  );

  useEffect(() => {
    if (open) {
      isClosingRef.current = false;
      cancelExitAnimation();
      if (rendered && hasEntered) {
        animate(openValue, 1, { duration: 0.18 });
      }
    }
  }, [open, rendered, hasEntered, cancelExitAnimation, openValue]);

  const close = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    cancelEntranceAnimation();
    cancelExitAnimation();
    let hasReleasedWrapper = false;
    let hasCompleted = false;

    const releaseWrapper = () => {
      if (hasReleasedWrapper) return;
      hasReleasedWrapper = true;
      onOpenChange(false);
    };

    releaseWrapper();

    const complete = () => {
      if (hasCompleted) return;
      hasCompleted = true;
      isClosingRef.current = false;
      if (!openRef.current) {
        setRendered(false);
        setHasEntered(false);
        openValue.set(0);
      }
    };

    const fromY = y.get();
    const toY = Math.max(getGapHiddenYCurried(), fromY);
    animate(openValue, 0, { duration: 0.18 });

    exitTimeoutRef.current = setTimeout(() => complete(), 450);

    exitControlsRef.current = animate(y, toY, {
      ...motionTransitions.sheet.exit,
      onUpdate: (latest) => {
        if (latest >= toY - 10) {
          if (exitTimeoutRef.current !== null) {
            clearTimeout(exitTimeoutRef.current);
            exitTimeoutRef.current = null;
          }
          complete();
        }
      },
      onComplete: () => {
        if (exitTimeoutRef.current !== null) {
          clearTimeout(exitTimeoutRef.current);
          exitTimeoutRef.current = null;
        }
        complete();
      },
    });
  }, [
    onOpenChange,
    y,
    cancelEntranceAnimation,
    cancelExitAnimation,
    getGapHiddenYCurried,
    openValue,
  ]);

  useEffect(() => {
    if (!open) return;
    if (rendered && !hasEntered) {
      cancelEntranceAnimation();
      const currentVh = getViewportHeight();
      let initSnap: number;
      if (config?.defaultSnap !== undefined) {
        const points = normalizedSnapPoints;
        const ds = config.defaultSnap;
        if (Number.isInteger(ds) && ds >= 0 && ds < points.length) {
          initSnap = points[ds];
        } else {
          const idx = points.indexOf(ds);
          initSnap = idx >= 0 ? ds : maxSnap;
        }
      } else {
        initSnap = maxSnap;
      }
      const targetY = currentVh * (maxSnap - initSnap);

      y.jump(isFreeDrag ? 0 : currentVh * (maxSnap - initSnap + 1));
      setHasEntered(true);
      animate(openValue, 1, { duration: 0.18 });
      entranceFrameRef.current = requestAnimationFrame(() => {
        entranceControlsRef.current = animate(
          y,
          targetY,
          motionTransitions.sheet.entrance,
        );
      });
    }
  }, [
    open,
    rendered,
    hasEntered,
    maxSnap,
    normalizedSnapPoints,
    config?.defaultSnap,
    getViewportHeight,
    y,
    cancelEntranceAnimation,
    isFreeDrag,
    openValue,
  ]);

  const prevOpen = usePrevious(open);
  useEffect(() => {
    if (prevOpen && !open && rendered) close();
  }, [open, rendered, close, prevOpen]);

  useEffect(() => {
    if (!rendered || !hasEntered || isFreeDrag || !open) return;
    const targetY = getTargetYForSnap(currentSnap);
    const controls = animate(y, targetY, motionTransitions.sheet.snap);
    return () => controls.stop();
  }, [
    rendered,
    hasEntered,
    currentSnap,
    getTargetYForSnap,
    isFreeDrag,
    open,
    y,
  ]);

  useEscapeClose(open && config?.exit?.escape !== false, close);

  useEffect(() => {
    if (!open || !rendered) return;
    sheetRef.current?.focus({ preventScroll: true });
  }, [open, rendered]);

  const {
    handleDragEnd,
    handleContentPointerDown,
    handleContentPointerMove,
    handleContentPointerUp,
    handleContentPointerCancel,
  } = useSheetDrag({
    y,
    scrollRef,
    config,
    viewportHeight,
    getViewportHeight,
    sheetHeightPx,
    isFreeDrag,
    minPx,
    maxPx,
    maxSnap,
    normalizedSnapPoints,
    resolvedFreeDragHeightPx,
    isMinDefault,
    snapIndex,
    currentSnap,
    getTargetYForSnap,
    getGapHiddenY,
    close,
    cancelEntranceAnimation,
    onSnapIndexChange: setSnapIndex,
  });

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    if (config?.exit?.escape === false) return;
    event.stopPropagation();
    close();
  };

  const showProgress =
    !!config?.snapPoints?.length &&
    normalizedSnapPoints.length > 1 &&
    !isFreeDrag;

  const insetPx = showProgress ? inset : 8;

  const sheetNode = rendered ? (
    <View
      data-open="true"
      data-color-mode={dataColorMode}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top:
          typeof window !== "undefined" && window.visualViewport
            ? `${window.visualViewport.offsetTop}px`
            : 0,
        height: viewportHeight ? `${viewportHeight}px` : "100dvh",
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
          overlayOpacity={overlayOpacity}
          onClick={config?.exit?.overlay !== false ? close : undefined}
        />
      )}
      <View
        alignItems="flex-end"
        justifyContent="center"
        style={{
          position: "absolute",
          bottom: showProgress ? `${bottomGap}px` : "0.8rem",
          left: `${insetPx}px`,
          right: `${insetPx}px`,
          pointerEvents: "none",
          zIndex: 99990,
        }}
      >
        <View
          id={id}
          ref={sheetRef}
          data-popover-owner={config?.popoverOwnerId}
          className={config?.className}
          role={role}
          aria-modal={isOutsideConfig ? "true" : "false"}
          tabIndex={-1}
          shadow={config?.shadow ?? "Regular"}
          radius={showProgress ? radiusArr : (config?.radius ?? "ExtraBold")}
          motion={
            {
              drag: dragEnabled ? "y" : false,
              dragControls: dragControls,
              dragListener: false,
              dragConstraints: {
                top: 0,
                bottom:
                  isFreeDrag || config?.min !== undefined
                    ? Math.max(0, resolvedFreeDragHeightPx - minPx)
                    : viewportHeight,
              },
              dragElastic: {
                top: 0.18,
                bottom: config?.min !== undefined ? 0 : 0.85,
              },
              dragMomentum: false,
              onDragEnd: handleDragEnd as any,
            } as any
          }
          onKeyDown={handleDialogKeyDown}
          style={
            {
              y,
              width: width ? Size(width) : "100%",
              height:
                sheetHeight === "max-content"
                  ? "max-content"
                  : Size(sheetHeight),
              maxHeight:
                "calc(var(--sheet-viewport-height, 100dvh) - env(safe-area-inset-top) - 0.8rem)",
              "--sheet-viewport-height": viewportHeight
                ? `${viewportHeight}px`
                : "100dvh",
              flexDirection: "column",
              pointerEvents: "auto",
              position: "relative",
              visibility: hasEntered ? "visible" : "hidden",
              overflow: "hidden",
              zIndex: resolvedZIndex,
              willChange: "transform",
            } as any
          }
        >
          <View
            themePreset={config?.themePreset}
            background={config?.background ?? "Base2"}
            color={config?.color}
            backgroundBlur={config?.backgroundBlur}
            column
            gap={0}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              overflow: "hidden",
              ...config?.style,
            }}
          >
            <Pressable
              type="button"
              aria-label="시트 이동"
              onPointerDown={(event) => {
                if (!dragEnabled) return;
                dragControls.start(event);
              }}
              themeInteractive={false}
              paddingVertical={12}
              alignItems="center"
              justifyContent="center"
              style={{
                width: "100%",
                cursor: "default",
              }}
            >
              <View
                radius="Circle"
                background="Base6TP4"
                style={{
                  width: "4.2rem",
                  height: "0.6rem",
                }}
              />
            </Pressable>

            <DialogHeader
              config={config?.header}
              exitIcon={config?.exit?.icon}
              onExit={close}
            />

            <View
              ref={scrollRef}
              onPointerDown={handleContentPointerDown}
              onPointerMove={handleContentPointerMove}
              onPointerUp={handleContentPointerUp}
              onPointerCancel={handleContentPointerCancel}
              padding={[0, 4, 4, 4]}
              style={{
                flex: "1 1 auto",
                overflowY: "auto",
                touchAction: "pan-y",
                minHeight: 0,
              }}
            >
              {children}
            </View>

            <DialogFooter
              config={config?.footer}
              exitButton={config?.exit?.footerButton}
              onExit={close}
            />
          </View>
        </View>
      </View>
    </View>
  ) : null;

  if (!mounted) return null;
  return <DialogPortal>{sheetNode}</DialogPortal>;
}


