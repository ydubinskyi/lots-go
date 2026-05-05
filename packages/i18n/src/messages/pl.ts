const pl = {
  common: {
    loading: "Ładowanie...",
    error: "Wystąpił błąd",
  },
  theme: {
    toggle: "Przełącz motyw",
    light: "Jasny",
    dark: "Ciemny",
    system: "Systemowy",
  },
  errors: {
    notFound: {
      title: "Strona nie znaleziona",
      description: "Strona, której szukasz, nie istnieje lub została przeniesiona.",
      goHome: "Wróć do strony głównej",
    },
    serverError: {
      title: "Coś poszło nie tak",
      description: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.",
      tryAgain: "Spróbuj ponownie",
      goHome: "Wróć do strony głównej",
    },
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
  admin: {
    nav: {
      management: "Zarządzanie",
      dashboard: "Panel",
      categories: "Kategorie",
      attributes: "Atrybuty",
      users: "Użytkownicy",
      products: "Produkty",
      settings: "Ustawienia",
      adminLabel: "Panel administracyjny",
      goToStorefront: "Przejdź do sklepu",
    },
    dashboard: {
      title: "Admin",
      subtitle: "Metryki panelu wkrótce.",
    },
    categories: {
      title: "Kategorie",
      newCategory: "Nowa kategoria",
      noCategories: "Brak kategorii",
      childCount:
        "{count, plural, one {# podkategoria} few {# podkategorie} many {# podkategorii} other {# podkategorii}}",
    },
    categoryNew: {
      title: "Nowa kategoria",
      parentLabel: "Kategoria nadrzędna",
      noParent: "Brak (kategoria główna)",
      sortOrderLabel: "Kolejność",
      translations: {
        tabLabel: "{locale}",
        titleLabel: "Tytuł",
        slugLabel: "Slug",
      },
      submit: "Utwórz kategorię",
      cancel: "Anuluj",
    },
    categoryDetail: {
      id: "ID",
      depth: "Głębokość",
      sortOrder: "Kolejność",
      translations: "Tłumaczenia",
      attachedAttributes: "Przypisane atrybuty",
      attachAttribute: "Przypisz atrybut",
      noAttributes: "Brak przypisanych atrybutów",
      detach: "Odepnij",
      code: "Kod",
      label: "Etykieta",
      slug: "Slug",
      sortOrderCol: "Kolejność",
      required: "Wymagany",
    },
    attachAttribute: {
      title: "Przypisz atrybut",
      attributeLabel: "Atrybut",
      selectAttribute: "Wybierz atrybut…",
      sortOrderLabel: "Kolejność",
      isRequiredLabel: "Wymagany",
      submit: "Przypisz",
      cancel: "Anuluj",
    },
    attributes: {
      title: "Atrybuty",
      newAttribute: "Nowy atrybut",
      code: "Kod",
      label: "Etykieta",
      slug: "Slug",
      actions: "Akcje",
      view: "Podgląd",
      noAttributes: "Brak atrybutów",
      page: "Strona {page} z {total}",
      previous: "Poprzednia",
      next: "Następna",
    },
    attributeNew: {
      title: "Nowy atrybut",
      codeLabel: "Kod",
      translations: {
        labelLabel: "Etykieta",
        slugLabel: "Slug",
      },
      submit: "Utwórz atrybut",
      cancel: "Anuluj",
    },
    attributeDetail: {
      title: "Szczegóły atrybutu",
      id: "ID",
      code: "Kod",
      translations: "Tłumaczenia",
      language: "Język",
      label: "Etykieta",
      slug: "Slug",
    },
  },
} as const

export default pl
