import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "use-intl";

import type { CategoriesTreeOutput } from "@lots-go/api-client";
import { isValidLocale, DEFAULT_LOCALE } from "@lots-go/i18n";
import { Button } from "@lots-go/ui/components/button";
import { Link } from "@lots-go/ui/link";

import { CategoriesTree } from "@/components/admin/categories-tree";
import { categoriesTreeQuery } from "@/lib/queries";

export const Route = createFileRoute("/{-$locale}/admin/categories/")({
  loader: async ({ params, context }) => {
    const locale = isValidLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
    await context.queryClient.ensureQueryData(categoriesTreeQuery(locale));
  },
  component: CategoriesPage,
});

function CategoriesPage() {
  const { locale } = useLoaderData({ from: "/{-$locale}" });
  const t = useTranslations("admin.categories");

  const { data } = useQuery<CategoriesTreeOutput>(categoriesTreeQuery(locale));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Button asChild>
          <Link href="/admin/categories/new">{t("newCategory")}</Link>
        </Button>
      </div>

      <CategoriesTree items={data?.items ?? []} />
    </div>
  );
}
