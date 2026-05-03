const uk = {
  common: {
    loading: "Завантаження...",
    error: "Сталася помилка",
  },
  nav: {
    brand: "lots-go",
    selectLanguage: "Оберіть мову",
    languages: {
      en: "Англійська",
      pl: "Польська",
      uk: "Українська",
    },
  },
  home: {
    categoriesHeading: "Категорії",
    showingRoots:
      "Показано {count, plural, one {# кореневу категорію} few {# кореневі категорії} many {# кореневих категорій} other {# кореневих категорій}} мовою {locale}.",
    emptyState: "Категорій ще немає. Запустіть {command} у бекенді.",
    subcategoriesCount:
      "{count, plural, one {# підкатегорія} few {# підкатегорії} many {# підкатегорій} other {# підкатегорій}}",
  },
} as const;

export default uk;
