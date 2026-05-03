import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import { LinkProvider, Link } from "@lots-go/ui/link";

import appCss from "@lots-go/ui/globals.css?url";

import { TanStackLinkAdapter } from "@/components/link-adapter";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { getLocale } from "@/lib/locale";

export const Route = createRootRoute({
  loader: () => getLocale(),
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "lots-go (TanStack Start)" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => (
    <main className="container mx-auto p-4 pt-16">
      <h1>404</h1>
      <p>The requested page could not be found.</p>
    </main>
  ),
  shellComponent: RootDocument,
  component: RootShell,
});

function RootShell() {
  const locale = Route.useLoaderData();
  return (
    <LinkProvider component={TanStackLinkAdapter}>
      <div className="min-h-svh flex flex-col">
        <header className="border-b">
          <div className="container mx-auto flex items-center justify-between gap-4 p-4">
            <Link href="/" className="font-semibold">
              lots-go
            </Link>
            <LocaleSwitcher current={locale} />
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </LinkProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
