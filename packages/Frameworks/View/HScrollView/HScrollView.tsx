"use client";

import clsx from "clsx";
import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import {
  Children,
  type CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Size } from "../../_shared/sizing";
import EdgeEffect from "../../EdgeEffect/EdgeEffect";
import { Radius } from "../../Theme/Radius.types";
import {
  BackgroundBlur,
  Border,
  resolveThemeClasses,
} from "../../Theme/Theme.types";
import View from "../View";
import viewStyles from "../View.module.scss";
import styles from "./HScrollView.module.scss";
import type {
  HScrollViewProps,
  HScrollViewViewport,
} from "./HScrollView.types";

type HScrollViewStyle = CSSProperties & {
  "--view-default-gap"?: string | number;
  "--h-scroll-item-width"?: string | number;
  "--h-scroll-item-height"?: string | number;
};

const VIEWPORT_MAX_QUERY: Record<HScrollViewViewport, string> = {
  w1: "(max-width: 319.98px)",
  w2: "(max-width: 409.98px)",
  w3: "(max-width: 767.98px)",
  w4: "(max-width: 1279.98px)",
};

export default forwardRef<HTMLDivElement, HScrollViewProps>(
  function HScrollView(
    {
      active = true,
      children,
      className,
      style,
      rootStyle,
      containerStyle,
      activeContainerStyle,
      inactiveContainerStyle,
      itemWidth,
      itemHeight,
      renderControls,
      showEdgeEffect = true,
      themePreset,
      background,
      color,
      themeInteractive,
      selected,
      border,
      radius,
      backgroundBlur,
      alignItems,
      justifyContent,
      wrap,
      gap,
      fullWidth,
      width,
      height,
      padding,
      margin,
      "data-color-mode": dataColorMode,
      ...rest
    },
    ref,
  ) {
    const wheelPlugin = useMemo(
      () => WheelGesturesPlugin({ forceWheelAxis: "x" }),
      [],
    );
    const emblaPlugins = useMemo(() => [wheelPlugin], [wheelPlugin]);
    const lastLocationRef = useRef(0);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const [isScrollActive, setIsScrollActive] = useState(() => active === true);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const slideCount = Children.count(children);
    const hasSingleSlide = slideCount <= 1;
    const shouldUseEmbla = isScrollActive && !hasSingleSlide;
    const baseContainerStyle: CSSProperties = isScrollActive
      ? (activeContainerStyle ??
        containerStyle ?? {
          alignItems,
          justifyContent,
          flexDirection: "row",
          flexWrap: wrap,
          gap: Size(gap),
        })
      : (inactiveContainerStyle ??
        containerStyle ?? {
          alignItems,
          justifyContent,
          flexWrap: wrap,
          gap: Size(gap),
        });

    const resolvedContainerStyle = useMemo<CSSProperties>(
      () => ({
        ...baseContainerStyle,
        flexWrap: isScrollActive ? "nowrap" : baseContainerStyle?.flexWrap,
        flexDirection: "row",
        touchAction: isScrollActive
          ? shouldUseEmbla
            ? "pan-y pinch-zoom"
            : baseContainerStyle?.touchAction
          : baseContainerStyle?.touchAction,
      }),
      [baseContainerStyle, isScrollActive, shouldUseEmbla],
    );
    const gapValue = resolvedContainerStyle.gap;

    const emblaOptions = useMemo<EmblaOptionsType>(
      () => ({
        active: shouldUseEmbla,
        align: "start",
        dragFree: true,
        axis: "x",
      }),
      [shouldUseEmbla],
    );
    const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions, emblaPlugins);
    const setViewportRef = useCallback(
      (node: HTMLDivElement | null) => {
        viewportRef.current = node;
        emblaRef(node);
      },
      [emblaRef],
    );

    const scrollNative = useCallback((direction: -1 | 1) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      viewport.scrollBy({
        left: viewport.clientWidth * direction * 0.85,
        behavior: "smooth",
      });
    }, []);

    const scrollPrev = useCallback(() => {
      if (emblaApi && shouldUseEmbla) {
        emblaApi.scrollPrev();
        return;
      }

      scrollNative(-1);
    }, [emblaApi, scrollNative, shouldUseEmbla]);

    const scrollNext = useCallback(() => {
      if (emblaApi && shouldUseEmbla) {
        emblaApi.scrollNext();
        return;
      }

      scrollNative(1);
    }, [emblaApi, scrollNative, shouldUseEmbla]);

    const syncControls = useCallback(() => {
      if (emblaApi && shouldUseEmbla) {
        const progress = emblaApi.scrollProgress();
        setCanScrollPrev(progress > 0.005);
        setCanScrollNext(progress < 0.995);
        return;
      }

      const viewport = viewportRef.current;
      if (!viewport) return;

      setCanScrollPrev(Math.ceil(viewport.scrollLeft) > 0);
      setCanScrollNext(
        Math.ceil(viewport.scrollLeft + viewport.clientWidth) <
          viewport.scrollWidth,
      );
    }, [emblaApi, shouldUseEmbla]);

    useEffect(() => {
      if (active === true) {
        setIsScrollActive(true);
        return;
      }

      if (!active) {
        setIsScrollActive(false);
        return;
      }

      const mediaQueryList = window.matchMedia(VIEWPORT_MAX_QUERY[active]);
      const syncActive = () => {
        setIsScrollActive(mediaQueryList.matches);
      };

      syncActive();
      mediaQueryList.addEventListener("change", syncActive);
      return () => {
        mediaQueryList.removeEventListener("change", syncActive);
      };
    }, [active]);

    useEffect(() => {
      if (!emblaApi || !shouldUseEmbla) return;

      const syncLocation = () => {
        lastLocationRef.current = emblaApi.internalEngine().location.get();
      };

      syncLocation();
      emblaApi.on("scroll", syncLocation);
      emblaApi.on("select", syncLocation);
      emblaApi.on("settle", syncLocation);

      return () => {
        emblaApi.off("scroll", syncLocation);
        emblaApi.off("select", syncLocation);
        emblaApi.off("settle", syncLocation);
      };
    }, [emblaApi, shouldUseEmbla]);

    useEffect(() => {
      syncControls();

      if (emblaApi && shouldUseEmbla) {
        emblaApi.on("select", syncControls);
        emblaApi.on("scroll", syncControls);
        emblaApi.on("reInit", syncControls);

        return () => {
          emblaApi.off("select", syncControls);
          emblaApi.off("scroll", syncControls);
          emblaApi.off("reInit", syncControls);
        };
      }

      const viewport = viewportRef.current;
      if (!viewport) return;

      viewport.addEventListener("scroll", syncControls);
      window.addEventListener("resize", syncControls);

      let observer: ResizeObserver | null = null;
      if (typeof ResizeObserver !== "undefined") {
        observer = new ResizeObserver(() => {
          syncControls();
        });
        observer.observe(viewport);
        if (viewport.firstElementChild) {
          observer.observe(viewport.firstElementChild);
        }
      }

      return () => {
        viewport.removeEventListener("scroll", syncControls);
        window.removeEventListener("resize", syncControls);
        if (observer) {
          observer.disconnect();
        }
      };
    }, [emblaApi, shouldUseEmbla, syncControls]);

    useEffect(() => {
      if (!emblaApi || !shouldUseEmbla) return;

      const shouldReInit = slideCount > 0 || gapValue !== undefined;
      if (!shouldReInit) return;

      const frame = window.requestAnimationFrame(() => {
        const previousLocation = lastLocationRef.current;
        emblaApi.reInit();
        const engine = emblaApi.internalEngine();
        engine.location.set(previousLocation);
        engine.previousLocation.set(previousLocation);
        engine.offsetLocation.set(previousLocation);
        engine.target.set(previousLocation);
        engine.translate.to(previousLocation);
      });

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }, [emblaApi, gapValue, shouldUseEmbla, slideCount]);

    const themeClasses = resolveThemeClasses({
      themePreset,
      background,
      color,
      themeInteractive,
      selected,
      isInteractive: false,
    });
    const resolvedRootStyle: HScrollViewStyle = {
      position: "relative",
      "--view-default-gap": Size(gap ?? 12),
      "--h-scroll-item-width": Size(itemWidth),
      "--h-scroll-item-height": Size(itemHeight),
      width: Size(width),
      height: Size(height),
      padding: Size(padding),
      margin: Size(margin),
      borderRadius: Radius(radius),
      ...rootStyle,
      ...style,
    };

    const controls = renderControls?.({
      scrollPrev,
      scrollNext,
      canScrollPrev,
      canScrollNext,
      isScrollActive,
    });

    return (
      <View
        ref={ref}
        column
        data-color-mode={dataColorMode}
        data-h-scroll-active={isScrollActive ? "true" : "false"}
        {...rest}
        className={clsx(
          viewStyles.View,
          ...themeClasses,
          Border(border),
          BackgroundBlur(backgroundBlur),
          fullWidth && styles.FullWidth,
          className,
          hasSingleSlide && styles.SingleChild,
        )}
        style={resolvedRootStyle}
      >
        <View
          ref={setViewportRef}
          data-embla-active={emblaApi && shouldUseEmbla ? "true" : "false"}
          className={styles.Viewport}
        >
          <View className={styles.Container} style={resolvedContainerStyle}>
            {children}
          </View>
        </View>
        {showEdgeEffect && canScrollPrev && (
          <EdgeEffect
            side="left"
            style={{
              position: "absolute",
              zIndex: 2,
              pointerEvents: "none",
              top: 0,
              bottom: 0,
              left: 0,
              width: "2.4rem",
            }}
          />
        )}
        {showEdgeEffect && canScrollNext && (
          <EdgeEffect
            side="right"
            style={{
              position: "absolute",
              zIndex: 2,
              pointerEvents: "none",
              top: 0,
              bottom: 0,
              right: 0,
              width: "2.4rem",
            }}
          />
        )}
        {controls}
      </View>
    );
  },
);
