import { createFileRoute } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@lots-go/ui/components/card";
import { Link } from "@lots-go/ui/link";

import { apiClient } from "@/lib/api";
import { getLocale } from "@/lib/locale";

export const Route = createFileRoute("/")({
  loader: async () => {
    const locale = await getLocale();
    const tree = await apiClient.getCategoryTree({ locale });
    return { locale, tree };
  },
  component: HomePage,
});

function HomePage() {
  const { locale, tree } = Route.useLoaderData();

  return (
    <section className="container mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <p className="text-muted-foreground text-sm">
          Showing {tree.items.length} root categor{tree.items.length === 1 ? "y" : "ies"} in{" "}
          <span className="font-mono">{locale}</span>.
        </p>
      </header>

      {tree.items.length === 0 ? (
        <p className="text-muted-foreground">
          No categories yet. Run <span className="font-mono">make seed-up</span> in the backend.
        </p>
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
                        {item.children.length} subcategor
                        {item.children.length === 1 ? "y" : "ies"}
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
