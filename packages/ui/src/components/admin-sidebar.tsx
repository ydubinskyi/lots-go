import {
  FolderTreeIcon,
  GavelIcon,
  LayoutDashboardIcon,
  PackageIcon,
  SettingsIcon,
  StoreIcon,
  TagIcon,
  UsersIcon,
} from "lucide-react";
import { useTranslations } from "use-intl";

import { Link } from "@lots-go/ui/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@lots-go/ui/components/sidebar";

interface NavItem {
  labelKey: string;
  icon: React.ElementType;
  href: string;
}

type NavLabelKey = "dashboard" | "categories" | "attributes" | "users" | "products" | "settings";

export function AdminSidebar() {
  const t = useTranslations("admin.nav");

  const activeItems: Array<NavItem & { labelKey: NavLabelKey }> = [
    { labelKey: "dashboard", icon: LayoutDashboardIcon, href: "/admin" },
    { labelKey: "categories", icon: FolderTreeIcon, href: "/admin/categories" },
    { labelKey: "attributes", icon: TagIcon, href: "/admin/attributes" },
  ];

  const disabledItems: Array<NavItem & { labelKey: NavLabelKey }> = [
    { labelKey: "users", icon: UsersIcon, href: "#" },
    { labelKey: "products", icon: PackageIcon, href: "#" },
    { labelKey: "settings", icon: SettingsIcon, href: "#" },
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <GavelIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">lots-go</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {t("adminLabel")}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <StoreIcon />
                <span>{t("goToStorefront")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <div className="mx-2 h-px bg-sidebar-border" role="separator" aria-orientation="horizontal" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("management")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeItems.map((item) => (
                <SidebarMenuItem key={item.labelKey}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {disabledItems.map((item) => (
                <SidebarMenuItem key={item.labelKey}>
                  <SidebarMenuButton
                    disabled
                    className="cursor-not-allowed text-muted-foreground opacity-50"
                    aria-disabled="true"
                  >
                    <item.icon />
                    <span>{t(item.labelKey)}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
