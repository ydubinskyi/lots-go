import { Tabs, TabsContent, TabsList, TabsTrigger } from "@lots-go/ui/components/tabs";

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@lots-go/i18n";
import type { Locale } from "@lots-go/i18n";

interface TranslationsTabsProps {
  renderTab: (locale: Locale, index: number) => React.ReactNode;
}

export function TranslationsTabs({ renderTab }: TranslationsTabsProps) {
  return (
    <Tabs defaultValue={DEFAULT_LOCALE}>
      <TabsList>
        {SUPPORTED_LOCALES.map((locale) => (
          <TabsTrigger key={locale} value={locale}>
            {locale.toUpperCase()}
          </TabsTrigger>
        ))}
      </TabsList>
      {SUPPORTED_LOCALES.map((locale, index) => (
        <TabsContent key={locale} value={locale} className="space-y-4 pt-4">
          {renderTab(locale, index)}
        </TabsContent>
      ))}
    </Tabs>
  );
}
