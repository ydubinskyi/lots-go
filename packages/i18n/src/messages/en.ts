const en = {
  common: {
    loading: "Loading...",
    error: "An error occurred",
  },
  nav: {
    brand: "lots-go",
    selectLanguage: "Select language",
    languages: {
      en: "English",
      pl: "Polski",
      uk: "Українська",
    },
  },
  home: {
    categoriesHeading: "Categories",
    showingRoots:
      "Showing {count, plural, one {# root category} other {# root categories}} in {locale}.",
    emptyState: "No categories yet. Run {command} in the backend.",
    subcategoriesCount: "{count, plural, one {# subcategory} other {# subcategories}}",
  },
} as const;

export default en;
