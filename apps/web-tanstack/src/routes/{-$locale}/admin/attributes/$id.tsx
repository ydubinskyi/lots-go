import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useLoaderData, useParams } from "@tanstack/react-router"
import { useTranslations } from "use-intl"

import type { AttributeDetailsOutput } from "@lots-go/api-client"
import { isValidLocale, DEFAULT_LOCALE } from "@lots-go/i18n"

import { attributeDetailQuery } from "@/lib/queries"

export const Route = createFileRoute("/{-$locale}/admin/attributes/$id")({
  loader: async ({ params, context }) => {
    const locale = isValidLocale(params.locale) ? params.locale : DEFAULT_LOCALE
    await context.queryClient.ensureQueryData(attributeDetailQuery(params.id, locale))
  },
  component: AttributeDetailPage,
})

function AttributeDetailPage() {
  const { locale } = useLoaderData({ from: "/{-$locale}" })
  const { id } = useParams({ from: "/{-$locale}/admin/attributes/$id" })
  const t = useTranslations("admin.attributeDetail")

  const { data: attribute } = useQuery<AttributeDetailsOutput>(attributeDetailQuery(id, locale))

  if (!attribute) return null

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">{attribute.code}</h1>

      <section className="space-y-2">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="text-muted-foreground font-medium">{t("id")}</dt>
          <dd className="font-mono">{attribute.id}</dd>
          <dt className="text-muted-foreground font-medium">{t("code")}</dt>
          <dd className="font-mono">{attribute.code}</dd>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{t("translations")}</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 font-medium">{t("language")}</th>
              <th className="pb-2 font-medium">{t("label")}</th>
              <th className="pb-2 font-medium">{t("slug")}</th>
            </tr>
          </thead>
          <tbody>
            {attribute.translations.map((tr) => (
              <tr key={tr.id} className="border-b last:border-0">
                <td className="py-2 font-mono uppercase">{tr.language_code}</td>
                <td className="py-2">{tr.label}</td>
                <td className="text-muted-foreground py-2 font-mono text-xs">{tr.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}
