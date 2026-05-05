import type { Locale } from "@lots-go/i18n"

const PL_MAP: Record<string, string> = {
  ą: "a",
  ć: "c",
  ę: "e",
  ł: "l",
  ń: "n",
  ó: "o",
  ś: "s",
  ź: "z",
  ż: "z",
}

const UK_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ye",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "yi",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ю: "yu",
  я: "ya",
}

function applyMap(str: string, map: Record<string, string>): string {
  return str
    .split("")
    .map((c) => map[c] ?? map[c.toLowerCase()] ?? c)
    .join("")
}

export function slugify(title: string, locale: Locale): string {
  let s = title.toLowerCase()

  if (locale === "pl") {
    s = applyMap(s, PL_MAP)
  } else if (locale === "uk") {
    s = applyMap(s, UK_MAP)
  }

  return s
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
}
