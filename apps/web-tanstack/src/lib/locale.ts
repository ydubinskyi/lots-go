import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import type { Locale } from "@lots-go/api-client";

export const SUPPORTED_LOCALES = ["en", "pl", "uk"] as const satisfies readonly Locale[];
export const DEFAULT_LOCALE: Locale = "en";
const COOKIE_NAME = "locale";

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

export const getLocale = createServerFn({ method: "GET" }).handler((): Locale => {
  const raw = getCookie(COOKIE_NAME);
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
});

export const setLocale = createServerFn({ method: "POST" })
  .inputValidator((data: unknown): { locale: Locale } => {
    if (typeof data !== "object" || data === null || !("locale" in data)) {
      throw new Error("Missing locale");
    }
    const locale = (data as { locale: unknown }).locale;
    if (typeof locale !== "string" || !isLocale(locale)) {
      throw new Error(`Unsupported locale: ${String(locale)}`);
    }
    return { locale };
  })
  .handler(({ data }) => {
    setCookie(COOKIE_NAME, data.locale, {
      path: "/",
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    return { locale: data.locale };
  });
