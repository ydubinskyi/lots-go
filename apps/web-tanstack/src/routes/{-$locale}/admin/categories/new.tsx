import { useForm } from "@tanstack/react-form"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router"
import { useTranslations } from "use-intl"

import type { CategoriesTreeOutput } from "@lots-go/api-client"
import { isValidLocale, DEFAULT_LOCALE } from "@lots-go/i18n"
import type { Locale } from "@lots-go/i18n"
import { Button } from "@lots-go/ui/components/button"
import { Input } from "@lots-go/ui/components/input"
import { Label } from "@lots-go/ui/components/label"
import { Link } from "@lots-go/ui/link"

import { ParentCategoryCombobox } from "@/components/admin/parent-category-combobox"
import { TranslationsTabs } from "@/components/admin/translations-tabs"
import { useCreateCategory } from "@/lib/mutations"
import { categoriesTreeQuery } from "@/lib/queries"
import { slugify } from "@/lib/slugify"

const LOCALES: Locale[] = ["en", "pl", "uk"]

export const Route = createFileRoute("/{-$locale}/admin/categories/new")({
  loader: async ({ params, context }) => {
    const locale = isValidLocale(params.locale) ? params.locale : DEFAULT_LOCALE
    await context.queryClient.ensureQueryData(categoriesTreeQuery(locale))
  },
  component: NewCategoryPage,
})

function NewCategoryPage() {
  const { locale } = useLoaderData({ from: "/{-$locale}" })
  const t = useTranslations("admin.categoryNew")
  const navigate = useNavigate()
  const createCategory = useCreateCategory(locale)

  const { data: treeData } = useQuery<CategoriesTreeOutput>(categoriesTreeQuery(locale))

  const form = useForm({
    defaultValues: {
      parent_id: null as string | null,
      sort_order: 0,
      translations: LOCALES.map((lc) => ({
        language_code: lc,
        title: "",
        slug: "",
      })),
    },
    onSubmit: async ({ value }) => {
      const result = await createCategory.mutateAsync({
        parent_id: value.parent_id
          ? { UUID: value.parent_id, Valid: true }
          : { UUID: "00000000-0000-0000-0000-000000000000", Valid: false },
        sort_order: value.sort_order,
        translations: value.translations.map((tr) => ({
          language_code: tr.language_code,
          title: tr.title,
          slug: tr.slug,
        })),
      })
      void navigate({
        to: "/{-$locale}/admin/categories/$id",
        params: { id: result.id },
      })
    },
  })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/categories">{t("cancel")}</Link>
        </Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Label>{t("parentLabel")}</Label>
          <form.Field name="parent_id">
            {(field) => (
              <ParentCategoryCombobox
                value={field.state.value}
                onChange={(v) => field.handleChange(v)}
                items={treeData?.items ?? []}
              />
            )}
          </form.Field>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort_order">{t("sortOrderLabel")}</Label>
          <form.Field name="sort_order">
            {(field) => (
              <Input
                id="sort_order"
                type="number"
                min={0}
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            )}
          </form.Field>
        </div>

        <TranslationsTabs
          renderTab={(lc, index) => (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("translations.titleLabel")}</Label>
                <form.Field name={`translations[${index}].title` as "translations[0].title"}>
                  {(field) => (
                    <Input
                      value={field.state.value}
                      onChange={(e) => {
                        const newTitle = e.target.value
                        field.handleChange(newTitle)
                        form.setFieldValue(
                          `translations[${index}].slug` as "translations[0].slug",
                          slugify(newTitle, lc),
                        )
                      }}
                      placeholder={`Title in ${lc}`}
                    />
                  )}
                </form.Field>
              </div>
              <div className="space-y-2">
                <Label>{t("translations.slugLabel")}</Label>
                <form.Field name={`translations[${index}].slug` as "translations[0].slug"}>
                  {(field) => (
                    <Input
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="slug-in-locale"
                      className="font-mono"
                    />
                  )}
                </form.Field>
              </div>
            </div>
          )}
        />

        <Button type="submit" disabled={createCategory.isPending}>
          {t("submit")}
        </Button>
      </form>
    </div>
  )
}
