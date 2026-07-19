"use client";
import type { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useEffect, useMemo, useState } from "react";

export function useImageDialog(initialIndex: number) {
  const wheelPlugin = useMemo(() => WheelGesturesPlugin(), []);
  const options = useMemo<EmblaOptionsType>(() => ({ align: "center", containScroll: "keepSnaps", dragFree: false, startIndex: initialIndex }), [initialIndex]);
  const [galleryRef, galleryApi] = useEmblaCarousel(options, [wheelPlugin]);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  useEffect(() => { if (!galleryApi) return; const sync = () => { setSelectedIndex(galleryApi.selectedScrollSnap()); setCanScrollPrev(galleryApi.canScrollPrev()); setCanScrollNext(galleryApi.canScrollNext()); }; sync(); galleryApi.on("select", sync); galleryApi.on("reInit", sync); galleryApi.on("resize", sync); return () => { galleryApi.off("select", sync); galleryApi.off("reInit", sync); galleryApi.off("resize", sync); }; }, [galleryApi]);
  useEffect(() => { if (!galleryApi) return; const frame = window.requestAnimationFrame(() => { galleryApi.reInit(); galleryApi.scrollTo(initialIndex, true); }); return () => window.cancelAnimationFrame(frame); }, [galleryApi, initialIndex]);
  useEffect(() => { const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "ArrowLeft") { event.preventDefault(); galleryApi?.scrollPrev(); } if (event.key === "ArrowRight") { event.preventDefault(); galleryApi?.scrollNext(); } }; window.addEventListener("keydown", handleKeyDown); return () => window.removeEventListener("keydown", handleKeyDown); }, [galleryApi]);
  return { galleryRef, selectedIndex, scrollTo: (index: number) => galleryApi?.scrollTo(index), scrollPrev: () => galleryApi?.scrollPrev(), scrollNext: () => galleryApi?.scrollNext(), canScrollPrev, canScrollNext };
}
