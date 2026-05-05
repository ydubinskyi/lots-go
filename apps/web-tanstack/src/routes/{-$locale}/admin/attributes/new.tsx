import { createFileRoute, useLoaderData, useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "use-intl";

import type { Locale } from "@lots-go/i18n";
import { Button } from "@lots-go/ui/components/button";
import { Input } from "@lots-go/ui/components/input";
import { Label } from "@lots-go/ui/components/label";
import { Link } from "@lots-go/ui/link";

import { TranslationsTabs } from "@/components/admin/translations-tabs";
import { useCreateAttribute } from "@/lib/mutations";
import { slugify } from "@/lib/slugify";

const LOCALES: Locale[] = ["en", "pl", "uk"];

export const Route = createFileRoute("/{-$locale}/admin/attributes/new")({
  component: NewAttributePage,
});

function NewAttributePage() {
  const { locale } = useLoaderData({ from: "/{-$locale}" });
  const t = useTranslations("admin.attributeNew");
  const navigate = useNavigate();
  const createAttribute = useCreateAttribute(locale);

  const form = useForm({
    defaultValues: {
      code: "",
      translations: LOCALES.map((lc) => ({
        language_code: lc,
        label: "",
        slug: "",
      })),
    },
    onSubmit: async ({ value }) => {
      const result = await createAttribute.mutateAsync({
        code: value.code,
        translations: value.translations.map((tr) => ({
          language_code: tr.language_code,
          label: tr.label,
          slug: tr.slug,
        })),
      });
      void navigate({
        to: "/{-$locale}/admin/attributes/$id",
        params: { id: result.id },
      });
    },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <Button variant="outline" asChild>
          <Link href="/admin/attributes">{t("cancel")}</Link>
        </Button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Label htmlFor="code">{t("codeLabel")}</Label>
          <form.Field name="code">
            {(field) => (
              <Input
                id="code"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="attribute_code"
                className="font-mono"
              />
            )}
          </form.Field>
        </div>

        <TranslationsTabs
          renderTab={(lc, index) => (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t("translations.labelLabel")}</Label>
                <form.Field name={`translations[${index}].label` as "translations[0].label"}>
                  {(field) => (
                    <Input
                      value={field.state.value}
                      onChange={(e) => {
                        const newLabel = e.target.value;
                        field.handleChange(newLabel);
                        form.setFieldValue(
                          `translations[${index}].slug` as "translations[0].slug",
                          slugify(newLabel, lc),
                        );
                      }}
                      placeholder={`Label in ${lc}`}
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

        <Button type="submit" disabled={createAttribute.isPending}>
          {t("submit")}
        </Button>
      </form>
    </div>
  );
}
