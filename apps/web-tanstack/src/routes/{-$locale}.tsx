import { Outlet, createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { IntlProvider, useTranslations } from "use-intl";

import { isValidLocale, DEFAULT_LOCALE } from "@lots-go/i18n";
import type { Locale } from "@lots-go/i18n";
import { ErrorPage } from "@lots-go/ui/components/error-page";
import { NotFound } from "@lots-go/ui/components/not-found";
import { LinkProvider } from "@lots-go/ui/link";

import { TanStackLinkAdapter } from "@/components/link-adapter";
import { loadMessages } from "@/i18n/load-messages";



export const Route = createFileRoute("/{-$locale}")({
  beforeLoad: ({ params, location }) => {
    const locale = (params as { locale?: string }).locale;

    if (locale === DEFAULT_LOCALE) {
      const stripped = location.pathname.replace(/^\/en(\/|$)/, "/").replace(/\/{2,}/g, "/") || "/";
      throw redirect({ to: stripped, statusCode: 301 });
    }

    if (locale !== undefined && !isValidLocale(locale)) {
      throw notFound();
    }
  },
  loader: async ({ params }) => {
    const locale = (params as { locale?: string }).locale;
    const activeLocale: Locale = isValidLocale(locale) ? locale : DEFAULT_LOCALE;
    const messages = await loadMessages(activeLocale);
    return { locale: activeLocale, messages };
  },
  component: LocaleLayout,
  notFoundComponent: LocaleNotFound,
  errorComponent: LocaleErrorBoundary,
});

function LocaleNotFound() {
  const t = useTranslations("errors.notFound");
  return (
    <NotFound
      title={t("title")}
      description={t("description")}
      homeLabel={t("goHome")}
    />
  );
}

function LocaleErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslations("errors.serverError");
  return (
    <ErrorPage
      title={t("title")}
      description={t("description")}
      homeLabel={t("goHome")}
      tryAgainLabel={t("tryAgain")}
      onReset={reset}
      errorMessage={error?.message}
    />
  );
}

function LocaleLayout() {
  const { locale, messages } = Route.useLoaderData();
  return (
    <IntlProvider locale={locale} messages={messages} timeZone="UTC">
      <LinkProvider component={TanStackLinkAdapter}>
        <Outlet />
      </LinkProvider>
    </IntlProvider>
  );
}
