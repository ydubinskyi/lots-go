import { createFileRoute } from "@tanstack/react-router";
import { useTranslations } from "use-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lots-go/ui/components/card";
import { Link } from "@lots-go/ui/link";

import { apiClient } from "@/lib/api";
import { createServerFn } from "@tanstack/react-start";

const getCategoriesTree = createServerFn({ method: "GET" }).handler(async () => {
  const tree = await apiClient.getCategoryTree();
  return { tree };
});

export const Route = createFileRoute("/{-$locale}/")({
  loader: () => getCategoriesTree(),
  component: HomePage,
});

function HomePage() {
  const { tree } = Route.useLoaderData();
  const t = useTranslations();

  return (
    <section className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">{t("home.categoriesHeading")}</h1>
      </header>

      {tree.items.length === 0 ? (
        <p className="text-muted-foreground">{t("home.emptyState", { command: "make seed-up" })}</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tree.items.map((item) => (
            <li key={item.id}>
              <Link href={`/categories/${item.full_slug}`} className="block">
                <Card className="hover:bg-accent transition-colors">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className="font-mono text-xs">
                      /{item.full_slug}
                    </CardDescription>
                  </CardHeader>
                  {item.children.length > 0 && (
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        {t("home.subcategoriesCount", {
                          count: item.children.length,
                        })}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
