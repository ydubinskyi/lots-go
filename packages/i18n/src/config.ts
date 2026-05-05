import type { Locale } from "@lots-go/api-client"

export type { Locale }

export const SUPPORTED_LOCALES = ["en", "pl", "uk"] as const satisfies readonly Locale[]

export const DEFAULT_LOCALE: Locale = "en"

export function isValidLocale(value: string | undefined): value is Locale {
  return value !== undefined && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function extractLocaleFromPath(pathname: string): Locale | null {
  const match = /^\/([a-z]{2})(?:\/|$)/.exec(pathname)
  const candidate = match?.[1]
  if (!candidate || !isValidLocale(candidate) || candidate === DEFAULT_LOCALE) {
    return null
  }
  return candidate
}
