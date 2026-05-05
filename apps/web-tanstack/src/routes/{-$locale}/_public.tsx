import { Outlet, createFileRoute, useLoaderData } from "@tanstack/react-router"
import { useTranslations } from "use-intl"

import { SUPPORTED_LOCALES } from "@lots-go/i18n"
import { Link } from "@lots-go/ui/link"

import { LocaleSwitcher } from "@/components/locale-switcher"

export const Route = createFileRoute("/{-$locale}/_public")({
  component: PublicLayout,
})

function PublicLayout() {
  const { locale } = useLoaderData({ from: "/{-$locale}" })
  const t = useTranslations("nav")

  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between gap-4 p-4">
          <Link href="/" className="font-semibold">
            {t("brand")}
          </Link>
          <LocaleSwitcher locale={locale} supportedLocales={SUPPORTED_LOCALES} />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
