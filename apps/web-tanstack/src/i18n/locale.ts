import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestUrl } from "@tanstack/react-start/server"

import { extractLocaleFromPath, DEFAULT_LOCALE } from "@lots-go/i18n"
import type { Locale } from "@lots-go/i18n"

export const getCurrentLocale: () => Locale = createIsomorphicFn()
  .server(() => {
    const url = getRequestUrl()
    return extractLocaleFromPath(url.pathname) ?? DEFAULT_LOCALE
  })
  .client(() => {
    return extractLocaleFromPath(window.location.pathname) ?? DEFAULT_LOCALE
  })
