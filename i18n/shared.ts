import enUIKitMessages from "./messages/en/uikit.json";
import jpUIKitMessages from "./messages/jp/uikit.json";
import krUIKitMessages from "./messages/kr/uikit.json";

export type Locale = "en" | "kr" | "jp";

export type UIKitMessages = typeof krUIKitMessages;

const UIKIT_BY_LOCALE: Record<Locale, UIKitMessages> = {
  en: enUIKitMessages,
  kr: krUIKitMessages,
  jp: jpUIKitMessages,
};

export function normalizeLocale(locale?: string): Locale {
  const normalized =
    typeof locale === "string" ? locale.trim().toLowerCase() : "";

  if (normalized === "kr" || normalized === "ko") return "kr";
  if (normalized === "jp" || normalized === "ja") return "jp";
  if (normalized === "en") return "en";

  if (typeof document !== "undefined") {
    const documentLocale = document.documentElement.lang?.trim().toLowerCase();
    if (documentLocale === "kr" || documentLocale === "ko") return "kr";
    if (documentLocale === "jp" || documentLocale === "ja") return "jp";
    if (documentLocale === "en") return "en";
  }

  return "en";
}

export function Word(locale?: string): UIKitMessages {
  return UIKIT_BY_LOCALE[normalizeLocale(locale)];
}

function interpolate(
  template: string,
  params: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    key in params ? String(params[key]) : `{${key}}`,
  );
}

export function UIKitT(locale?: string) {
  const messages = Word(locale);
  return {
    ...messages.UIKit.actions,
    ...messages.UIKit.presets,
    ...messages.UIKit.ui,
    interpolate,
  };
}
