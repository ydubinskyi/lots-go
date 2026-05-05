import { createFileRoute, useLoaderData, useSearch, Link as RouterLink } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "use-intl";
import { z } from "zod";

import type { AttributeListItemOutput, PaginatedList } from "@lots-go/api-client";
import { isValidLocale, DEFAULT_LOCALE } from "@lots-go/i18n";
import { Button } from "@lots-go/ui/components/button";
import { Link } from "@lots-go/ui/link";

import { attributesListQuery } from "@/lib/queries";

const searchSchema = z.object({
  page: z.number().int().min(1).default(1).catch(1),
  pageSize: z.number().int().min(1).max(100).default(20).catch(20),
});

export const Route = createFileRoute("/{-$locale}/admin/attributes/")({
  validateSearch: searchSchema,
  loader: async ({ params, context }) => {
    const locale = isValidLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
    await context.queryClient.ensureQueryData(
      attributesListQuery({ page: 1, pageSize: 20 }, locale),
    );
  },
  component: AttributesPage,
});

function AttributesPage() {
  const { locale } = useLoaderData({ from: "/{-$locale}" });
  const { page, pageSize } = useSearch({ from: "/{-$locale}/admin/attributes/" });
  const t = useTranslations("admin.attributes");

  const { data } = useQuery<PaginatedList<AttributeListItemOutput>>(
    attributesListQuery({ page, pageSize }, locale),
  );

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Button asChild>
          <Link href="/admin/attributes/new">{t("newAttribute")}</Link>
        </Button>
      </div>

      {(data?.items ?? []).length === 0 ? (
        <p className="text-muted-foreground py-6 text-center">{t("noAttributes")}</p>
      ) : (
        <>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">{t("code")}</th>
                <th className="pb-3 font-medium">{t("label")}</th>
                <th className="pb-3 font-medium">{t("slug")}</th>
                <th className="pb-3 font-medium">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((attr: AttributeListItemOutput) => (
                <tr key={attr.id} className="border-b last:border-0">
                  <td className="py-3 font-mono">{attr.code}</td>
                  <td className="py-3">{attr.label}</td>
                  <td className="py-3 font-mono text-xs text-muted-foreground">{attr.slug}</td>
                  <td className="py-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/attributes/${attr.id}`}>{t("view")}</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t("page", { page, total: totalPages })}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} asChild>
                <RouterLink to="." search={{ page: page - 1, pageSize }}>
                  {t("previous")}
                </RouterLink>
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
                <RouterLink to="." search={{ page: page + 1, pageSize }}>
                  {t("next")}
                </RouterLink>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
