import { Outlet, createFileRoute, useLoaderData } from "@tanstack/react-router";

import { SUPPORTED_LOCALES } from "@lots-go/i18n";
import { AdminHeader } from "@lots-go/ui/components/admin-header";
import { AdminSidebar } from "@lots-go/ui/components/admin-sidebar";
import { ThemeToggle } from "@lots-go/ui/components/theme-toggle";
import { SidebarInset, SidebarProvider } from "@lots-go/ui/components/sidebar";

import { LocaleSwitcher } from "@/components/locale-switcher";

export const Route = createFileRoute("/{-$locale}/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { locale } = useLoaderData({ from: "/{-$locale}" });

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader
          actions={
            <>
              <LocaleSwitcher locale={locale} supportedLocales={SUPPORTED_LOCALES} />
              <ThemeToggle />
            </>
          }
        />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
