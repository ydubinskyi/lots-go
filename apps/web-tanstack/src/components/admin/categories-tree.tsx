import { ChevronRightIcon } from "lucide-react";
import { useTranslations } from "use-intl";

import type { CategoryTreeItem } from "@lots-go/api-client";
import { Badge } from "@lots-go/ui/components/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@lots-go/ui/components/collapsible";
import { Link } from "@lots-go/ui/link";

interface CategoriesTreeProps {
  items: CategoryTreeItem[];
}

export function CategoriesTree({ items }: CategoriesTreeProps) {
  const t = useTranslations("admin.categories");

  if (items.length === 0) {
    return <p className="text-muted-foreground py-6 text-center">{t("noCategories")}</p>;
  }

  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <TreeNode key={item.id} item={item} />
      ))}
    </ul>
  );
}

function TreeNode({ item }: { item: CategoryTreeItem }) {
  const t = useTranslations("admin.categories");
  const hasChildren = item.children.length > 0;

  return (
    <li>
      <Collapsible>
        <div className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted/50">
          {hasChildren ? (
            <CollapsibleTrigger asChild>
              <button type="button" className="flex items-center gap-1 focus:outline-none">
                <ChevronRightIcon className="size-4 transition-transform duration-200 [[data-state=open]_&]:rotate-90" />
              </button>
            </CollapsibleTrigger>
          ) : (
            <span className="size-4" />
          )}

          <Link href={`/admin/categories/${item.id}`} className="flex-1 font-medium hover:underline">
            {item.title}
          </Link>

          <span className="font-mono text-xs text-muted-foreground">{item.full_slug}</span>

          {hasChildren && (
            <Badge variant="secondary" className="text-xs">
              {t("childCount", { count: item.children.length })}
            </Badge>
          )}
        </div>

        {hasChildren && (
          <CollapsibleContent>
            <ul className="ml-6 mt-1 space-y-1 border-l pl-3">
              {item.children.map((child) => (
                <TreeNode key={child.id} item={child} />
              ))}
            </ul>
          </CollapsibleContent>
        )}
      </Collapsible>
    </li>
  );
}
