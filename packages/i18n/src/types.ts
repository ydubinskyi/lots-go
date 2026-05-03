import type en from "./messages/en.ts";

export type Messages = typeof en;

declare global {
  // use-intl reads this augmentation to type-check translation keys.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}
