import { getRequestConfig } from "next-intl/server";
import type { Locale } from "@/i18n/shared";

const locales: Locale[] = ["en", "kr", "jp"];
const defaultLocale: Locale = "en";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}/uikit.json`)).default,
  };
});
