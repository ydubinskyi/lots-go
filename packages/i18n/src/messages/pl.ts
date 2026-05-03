const pl = {
  common: {
    loading: "Ładowanie...",
    error: "Wystąpił błąd",
  },
  nav: {
    brand: "lots-go",
    selectLanguage: "Wybierz język",
    languages: {
      en: "Angielski",
      pl: "Polski",
      uk: "Ukraiński",
    },
  },
  home: {
    categoriesHeading: "Kategorie",
    showingRoots:
      "Wyświetlanie {count, plural, one {# kategorii głównej} few {# kategorii głównych} many {# kategorii głównych} other {# kategorii głównych}} w {locale}.",
    emptyState: "Brak kategorii. Uruchom {command} w backendzie.",
    subcategoriesCount:
      "{count, plural, one {# podkategoria} few {# podkategorie} many {# podkategorii} other {# podkategorii}}",
  },
} as const;

export default pl;
