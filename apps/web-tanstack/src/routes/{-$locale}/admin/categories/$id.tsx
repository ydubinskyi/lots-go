import * as React from "react";
import {
  createFileRoute,
  useLoaderData,
  useParams,
} from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "use-intl";

import type {
  AttributeListItemOutput,
  CategoryAttributeOutput,
  CategoryAttributesOutput,
  CategoryDetailsOutput,
} from "@lots-go/api-client";
import { isValidLocale, DEFAULT_LOCALE } from "@lots-go/i18n";
import { Badge } from "@lots-go/ui/components/badge";
import { Button } from "@lots-go/ui/components/button";
import { Input } from "@lots-go/ui/components/input";
import { Label } from "@lots-go/ui/components/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@lots-go/ui/components/sheet";
import { Switch } from "@lots-go/ui/components/switch";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@lots-go/ui/components/command";
import { CheckIcon } from "lucide-react";
import { cn } from "@lots-go/ui/lib/utils";

import { categoryDetailQuery, categoryAttributesQuery, attributesListQuery } from "@/lib/queries";
import { useAttachAttribute, useDetachAttribute } from "@/lib/mutations";

export const Route = createFileRoute("/{-$locale}/admin/categories/$id")({
  loader: async ({ params, context }) => {
    const locale = isValidLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
    await Promise.all([
      context.queryClient.ensureQueryData(categoryDetailQuery(params.id, locale)),
      context.queryClient.ensureQueryData(categoryAttributesQuery(params.id, locale)),
      context.queryClient.ensureQueryData(attributesListQuery({ page: 1, pageSize: 100 }, locale)),
    ]);
  },
  component: CategoryDetailPage,
});

function CategoryDetailPage() {
  const { locale } = useLoaderData({ from: "/{-$locale}" });
  const { id } = useParams({ from: "/{-$locale}/admin/categories/$id" });
  const t = useTranslations("admin.categoryDetail");
  const tAttach = useTranslations("admin.attachAttribute");

  const { data: category } = useQuery<CategoryDetailsOutput>(categoryDetailQuery(id, locale));
  const { data: catAttrs } = useQuery<CategoryAttributesOutput>(
    categoryAttributesQuery(id, locale),
  );
  const { data: allAttrs } = useQuery<{ items: AttributeListItemOutput[]; total: number; page: number; pageSize: number }>(
    attributesListQuery({ page: 1, pageSize: 100 }, locale),
  );

  const attachMutation = useAttachAttribute(id, locale);
  const detachMutation = useDetachAttribute(id, locale);

  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [selectedAttrId, setSelectedAttrId] = React.useState<string | null>(null);

  const attachForm = useForm({
    defaultValues: { sort_order: 0, is_required: false },
    onSubmit: async ({ value }) => {
      if (!selectedAttrId) return;
      await attachMutation.mutateAsync({
        attributeId: selectedAttrId,
        input: value,
      });
      setSheetOpen(false);
      setSelectedAttrId(null);
    },
  });

  const attachedIds = new Set(catAttrs?.items.map((a) => a.id) ?? []);
  const availableAttrs =
    allAttrs?.items.filter((a) => !attachedIds.has(a.id)) ?? [];

  if (!category) return null;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">
        {category.translations.find((tr) => tr.language_code === locale)?.title ??
          category.translations[0]?.title}
      </h1>

      <section className="space-y-2">
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <dt className="font-medium text-muted-foreground">{t("id")}</dt>
          <dd className="font-mono">{category.id}</dd>
          <dt className="font-medium text-muted-foreground">{t("depth")}</dt>
          <dd>{category.depth}</dd>
          <dt className="font-medium text-muted-foreground">{t("sortOrder")}</dt>
          <dd>{category.sort_order}</dd>
        </dl>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">{t("translations")}</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 font-medium">Lang</th>
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Slug</th>
            </tr>
          </thead>
          <tbody>
            {category.translations.map((tr) => (
              <tr key={tr.id} className="border-b last:border-0">
                <td className="py-2 font-mono uppercase">{tr.language_code}</td>
                <td className="py-2">{tr.title}</td>
                <td className="py-2 font-mono text-xs text-muted-foreground">{tr.slug}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">{t("attachedAttributes")}</h2>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                {t("attachAttribute")}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{tAttach("title")}</SheetTitle>
              </SheetHeader>
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  void attachForm.handleSubmit();
                }}
              >
                <div className="space-y-2">
                  <Label>{tAttach("attributeLabel")}</Label>
                  <Command className="rounded-md border">
                    <CommandInput placeholder={tAttach("selectAttribute")} />
                    <CommandList>
                      <CommandEmpty>No attributes available.</CommandEmpty>
                      <CommandGroup>
                        {availableAttrs.map((attr) => (
                          <CommandItem
                            key={attr.id}
                            value={attr.id}
                            onSelect={() => setSelectedAttrId(attr.id)}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 size-4",
                                selectedAttrId === attr.id ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {attr.label} <span className="ml-2 font-mono text-xs text-muted-foreground">{attr.code}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>

                <div className="space-y-2">
                  <Label>{tAttach("sortOrderLabel")}</Label>
                  <attachForm.Field name="sort_order">
                    {(field) => (
                      <Input
                        type="number"
                        min={0}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                      />
                    )}
                  </attachForm.Field>
                </div>

                <div className="flex items-center gap-3">
                  <attachForm.Field name="is_required">
                    {(field) => (
                      <Switch
                        id="is_required"
                        checked={field.state.value}
                        onCheckedChange={field.handleChange}
                      />
                    )}
                  </attachForm.Field>
                  <Label htmlFor="is_required">{tAttach("isRequiredLabel")}</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={!selectedAttrId || attachMutation.isPending}>
                    {tAttach("submit")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSheetOpen(false)}
                  >
                    {tAttach("cancel")}
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        {(catAttrs?.items ?? []).length === 0 ? (
          <p className="text-muted-foreground py-4 text-sm">{t("noAttributes")}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-2 font-medium">{t("code")}</th>
                <th className="pb-2 font-medium">{t("label")}</th>
                <th className="pb-2 font-medium">{t("sortOrderCol")}</th>
                <th className="pb-2 font-medium">{t("required")}</th>
                <th className="pb-2" />
              </tr>
            </thead>
            <tbody>
              {catAttrs?.items.map((attr: CategoryAttributeOutput) => (
                <tr key={attr.id} className="border-b last:border-0">
                  <td className="py-2 font-mono">{attr.code}</td>
                  <td className="py-2">{attr.label}</td>
                  <td className="py-2">{attr.sort_order}</td>
                  <td className="py-2">
                    <Badge variant={attr.is_required ? "default" : "secondary"}>
                      {attr.is_required ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="py-2 text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => detachMutation.mutate(attr.id)}
                      disabled={detachMutation.isPending}
                    >
                      {t("detach")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
