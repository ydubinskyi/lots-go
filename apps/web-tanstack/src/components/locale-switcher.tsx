import { useRouter } from "@tanstack/react-router";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lots-go/ui/components/select";
import type { Locale } from "@lots-go/api-client";
import { setLocale, SUPPORTED_LOCALES } from "@/lib/locale";

const LABELS: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
  uk: "Українська",
};

export function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChange = (next: string) => {
    startTransition(async () => {
      await setLocale({ data: { locale: next as Locale } });
      router.invalidate();
    });
  };

  return (
    <Select value={current} onValueChange={onChange} disabled={isPending}>
      <SelectTrigger className="w-32" aria-label="Select language">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SUPPORTED_LOCALES.map((code) => (
          <SelectItem key={code} value={code}>
            {LABELS[code]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
