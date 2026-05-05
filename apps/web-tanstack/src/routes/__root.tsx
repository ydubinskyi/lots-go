import { TanStackDevtools } from "@tanstack/react-devtools";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { QueryClient } from "@tanstack/react-query";

import { DEFAULT_LOCALE } from "@lots-go/i18n";
import type { Locale } from "@lots-go/i18n";
import en from "@lots-go/i18n/messages/en";
import { ErrorPage } from "@lots-go/ui/components/error-page";
import { NotFound } from "@lots-go/ui/components/not-found";
import { Toaster } from "@lots-go/ui/components/sonner";
import { ThemeProvider } from "@lots-go/ui/components/theme-provider";
import appCss from "@lots-go/ui/globals.css?url";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "lots-go (TanStack Start)" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => (
    <NotFound
      title={en.errors.notFound.title}
      description={en.errors.notFound.description}
      homeLabel={en.errors.notFound.goHome}
    />
  ),
  errorComponent: ({ error, reset }) => (
    <ErrorPage
      title={en.errors.serverError.title}
      description={en.errors.serverError.description}
      homeLabel={en.errors.serverError.goHome}
      tryAgainLabel={en.errors.serverError.tryAgain}
      onReset={reset}
      errorMessage={error?.message}
    />
  ),
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <Outlet />
      <Toaster />
    </ThemeProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = useRouterState({
    select: (s) => {
      for (const match of s.matches) {
        const data = match.loaderData as Record<string, unknown> | undefined;
        if (typeof data?.locale === "string") return data.locale as Locale;
      }
      return DEFAULT_LOCALE;
    },
  });

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {import.meta.env.DEV ? (
          <TanStackDevtools
            config={{ position: "bottom-left" }}
            plugins={[
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  );
}
