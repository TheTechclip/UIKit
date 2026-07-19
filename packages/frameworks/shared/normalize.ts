function isAlreadyResolvedImageSrc(value: string) {
  return /^(https?:\/\/|\/|data:|blob:)/i.test(value);
}

export function normalizeUIKitImageSrc(src?: string) {
  const resolvedSrc = typeof src === "string" ? src.trim() : "";

  if (!resolvedSrc) {
    return "";
  }

  if (isAlreadyResolvedImageSrc(resolvedSrc)) {
    return resolvedSrc;
  }

  return `/${resolvedSrc}`;
}

export function normalizeBrandIconClass(iconBrand?: string) {
  if (!iconBrand) {
    return undefined;
  }
  if (/^iBrand[A-Z]/.test(iconBrand)) {
    return iconBrand;
  }
  if (/^i[A-Z]/.test(iconBrand)) {
    return `iBrand${iconBrand.slice(1)}`;
  }
  return `iBrand${iconBrand}`;
}

export function normalizeLang(language?: string) {
  const raw = (language || "text").toLowerCase();
  if (raw === "html") return "markup";
  if (raw === "js") return "javascript";
  if (raw === "ts") return "typescript";
  if (raw === "md") return "markdown";
  return raw;
}
