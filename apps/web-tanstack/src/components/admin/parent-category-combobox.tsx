import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useTranslations } from "use-intl";

import type { CategoryTreeItem } from "@lots-go/api-client";
import { Button } from "@lots-go/ui/components/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@lots-go/ui/components/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@lots-go/ui/components/popover";
import { cn } from "@lots-go/ui/lib/utils";

interface ParentCategoryComboboxProps {
  value: string | null;
  onChange: (value: string | null) => void;
  items: CategoryTreeItem[];
}

function flattenCategories(
  items: CategoryTreeItem[],
): { id: string; label: string; depth: number }[] {
  const result: { id: string; label: string; depth: number }[] = [];
  for (const item of items) {
    result.push({ id: item.id, label: item.full_slug, depth: item.depth });
    for (const child of item.children) {
      result.push({ id: child.id, label: child.full_slug, depth: child.depth });
    }
  }
  return result;
}

export function ParentCategoryCombobox({
  value,
  onChange,
  items,
}: ParentCategoryComboboxProps) {
  const t = useTranslations("admin.categoryNew");
  const [open, setOpen] = React.useState(false);

  const flat = React.useMemo(
    () => flattenCategories(items).filter((c) => c.depth < 2),
    [items],
  );

  const selected = flat.find((c) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selected ? selected.label : t("noParent")}
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={t("parentLabel")} />
          <CommandList>
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="__none__"
                onSelect={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                <CheckIcon
                  className={cn("mr-2 size-4", value === null ? "opacity-100" : "opacity-0")}
                />
                {t("noParent")}
              </CommandItem>
              {flat.map((cat) => (
                <CommandItem
                  key={cat.id}
                  value={cat.id}
                  onSelect={() => {
                    onChange(cat.id);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 size-4",
                      value === cat.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {cat.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
