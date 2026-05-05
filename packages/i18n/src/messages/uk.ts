const uk = {
  common: {
    loading: "Завантаження...",
    error: "Сталася помилка",
  },
  theme: {
    toggle: "Перемкнути тему",
    light: "Світла",
    dark: "Темна",
    system: "Системна",
  },
  errors: {
    notFound: {
      title: "Сторінку не знайдено",
      description: "Сторінка, яку ви шукаєте, не існує або була переміщена.",
      goHome: "На головну",
    },
    serverError: {
      title: "Щось пішло не так",
      description: "Сталася неочікувана помилка. Будь ласка, спробуйте ще раз.",
      tryAgain: "Спробувати знову",
      goHome: "На головну",
    },
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
  admin: {
    nav: {
      management: "Управління",
      dashboard: "Панель",
      categories: "Категорії",
      attributes: "Атрибути",
      users: "Користувачі",
      products: "Товари",
      settings: "Налаштування",
      adminLabel: "Панель адміністратора",
      goToStorefront: "Перейти до магазину",
    },
    dashboard: {
      title: "Адмін",
      subtitle: "Метрики панелі з'являться незабаром.",
    },
    categories: {
      title: "Категорії",
      newCategory: "Нова категорія",
      noCategories: "Категорій ще немає",
      childCount:
        "{count, plural, one {# підкатегорія} few {# підкатегорії} many {# підкатегорій} other {# підкатегорій}}",
    },
    categoryNew: {
      title: "Нова категорія",
      parentLabel: "Батьківська категорія",
      noParent: "Без батьківської (коренева)",
      sortOrderLabel: "Порядок сортування",
      translations: {
        tabLabel: "{locale}",
        titleLabel: "Назва",
        slugLabel: "Слаг",
      },
      submit: "Створити категорію",
      cancel: "Скасувати",
    },
    categoryDetail: {
      id: "ID",
      depth: "Глибина",
      sortOrder: "Порядок",
      translations: "Переклади",
      attachedAttributes: "Прикріплені атрибути",
      attachAttribute: "Прикріпити атрибут",
      noAttributes: "Атрибути не прикріплені",
      detach: "Від'єднати",
      code: "Код",
      label: "Мітка",
      slug: "Слаг",
      sortOrderCol: "Порядок",
      required: "Обов'язковий",
    },
    attachAttribute: {
      title: "Прикріпити атрибут",
      attributeLabel: "Атрибут",
      selectAttribute: "Оберіть атрибут…",
      sortOrderLabel: "Порядок сортування",
      isRequiredLabel: "Обов'язковий",
      submit: "Прикріпити",
      cancel: "Скасувати",
    },
    attributes: {
      title: "Атрибути",
      newAttribute: "Новий атрибут",
      code: "Код",
      label: "Мітка",
      slug: "Слаг",
      actions: "Дії",
      view: "Переглянути",
      noAttributes: "Атрибутів ще немає",
      page: "Сторінка {page} з {total}",
      previous: "Попередня",
      next: "Наступна",
    },
    attributeNew: {
      title: "Новий атрибут",
      codeLabel: "Код",
      translations: {
        labelLabel: "Мітка",
        slugLabel: "Слаг",
      },
      submit: "Створити атрибут",
      cancel: "Скасувати",
    },
    attributeDetail: {
      title: "Деталі атрибуту",
      id: "ID",
      code: "Код",
      translations: "Переклади",
      language: "Мова",
      label: "Мітка",
      slug: "Слаг",
    },
  },
} as const

export default uk
