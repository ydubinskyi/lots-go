import type { AbstractIntlMessages } from "use-intl";
import type { Locale } from "@lots-go/i18n";

export async function loadMessages(locale: Locale): Promise<AbstractIntlMessages> {
  switch (locale) {
    case "pl":
      return (await import("@lots-go/i18n/messages/pl")).default;
    case "uk":
      return (await import("@lots-go/i18n/messages/uk")).default;
    default:
      return (await import("@lots-go/i18n/messages/en")).default;
  }
}
