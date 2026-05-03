import { Outlet, createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { IntlProvider } from "use-intl";

import { isValidLocale, DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@lots-go/i18n";
import type { Locale } from "@lots-go/i18n";
import { Link, LinkProvider } from "@lots-go/ui/link";

import { TanStackLinkAdapter } from "@/components/link-adapter";
import { LocaleSwitcher } from "@/components/locale-switcher";
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
});

function LocaleLayout() {
  const { locale, messages } = Route.useLoaderData();
  return (
    <IntlProvider locale={locale} messages={messages} timeZone="UTC">
      <LinkProvider component={TanStackLinkAdapter}>
        <div className="flex min-h-svh flex-col">
          <header className="border-b">
            <div className="container mx-auto flex items-center justify-between gap-4 p-4">
              <Link href="/" className="font-semibold">
                lots-go
              </Link>
              <LocaleSwitcher locale={locale} supportedLocales={SUPPORTED_LOCALES} />
            </div>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </LinkProvider>
    </IntlProvider>
  );
}
