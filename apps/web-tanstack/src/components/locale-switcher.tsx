import { useRouter } from "@tanstack/react-router"
import { useTranslations } from "use-intl"

import { DEFAULT_LOCALE } from "@lots-go/i18n"
import type { Locale } from "@lots-go/i18n"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lots-go/ui/components/select"

interface LocaleSwitcherProps {
  locale: Locale
  supportedLocales: readonly Locale[]
}

export function LocaleSwitcher({ locale, supportedLocales }: LocaleSwitcherProps) {
  const router = useRouter()
  const t = useTranslations("nav")

  const onChange = (next: string) => {
    const currentPath = window.location.pathname
    const currentLocale = locale

    let basePath: string
    if (currentLocale === DEFAULT_LOCALE) {
      basePath = currentPath
    } else {
      basePath = currentPath.replace(new RegExp(`^/${currentLocale}(?=/|$)`), "") || "/"
    }

    const newPath =
      next === DEFAULT_LOCALE ? basePath || "/" : `/${next}${basePath === "/" ? "" : basePath}`

    void router.navigate({ to: newPath })
  }

  return (
    <Select value={locale} onValueChange={onChange}>
      <SelectTrigger className="w-32" aria-label={t("selectLanguage")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {supportedLocales.map((code) => (
          <SelectItem key={code} value={code}>
            {t(`languages.${code}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
