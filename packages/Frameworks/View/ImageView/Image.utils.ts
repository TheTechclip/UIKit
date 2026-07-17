import type { ReactNode } from "react";
import type {
  ImageItem,
  ImageOverlay,
} from "@/packages/Frameworks/View/ImageView/Image.types";

export type ImageMode = "inline" | "dialog";

export function resolveItems(
  src: string | string[] | ImageItem[],
  alt?: string | string[],
): ImageItem[] {
  if (typeof src === "string") {
    const resolvedAlt =
      typeof alt === "string" ? alt : Array.isArray(alt) ? (alt[0] ?? "") : "";
    return [{ id: 0, src, alt: resolvedAlt }];
  }

  if (src.length === 0) return [];

  if (typeof src[0] === "string") {
    return (src as string[]).map((s, i) => ({
      id: i,
      src: s,
      alt: Array.isArray(alt)
        ? (alt[i] ?? "")
        : typeof alt === "string"
          ? alt
          : "",
    }));
  }

  return src as ImageItem[];
}

export function resolveImageSrc(item: ImageItem, mode: ImageMode): string {
  return mode === "dialog" ? (item.srcDialog ?? item.src) : item.src;
}

export function resolveOverlay(
  overlay: ImageOverlay | undefined,
  index: number,
): ReactNode {
  if (overlay == null) return null;
  if (Array.isArray(overlay)) return (overlay as ReactNode[])[index] ?? null;
  return overlay;
}

export function resolveAtIndex<T>(
  value: T | T[] | undefined,
  index: number,
): T | undefined {
  if (value === undefined) return undefined;
  if (Array.isArray(value)) return (value as T[])[index];
  return value;
}

const FALLBACK_BLURS = [
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmVjYWNhIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmVkN2FhIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmVmMDhhIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZDlmOTlkIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjYmJmN2QwIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjOTlmNmU0Ii8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjYmZkYmZlIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjYzdkMmZlIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZTlkNWZmIi8+PC9zdmc+",
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZmJjZmU4Ii8+PC9zdmc+",
];

export function resolveBlurDataURL(item: ImageItem, index: number): string {
  if (item.blurDataURL) return item.blurDataURL;

  const hash =
    String(item.id)
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) + index;
  return FALLBACK_BLURS[hash % FALLBACK_BLURS.length]!;
}
