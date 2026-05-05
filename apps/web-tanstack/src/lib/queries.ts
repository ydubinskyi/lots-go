import { queryOptions } from "@tanstack/react-query";

import type { Locale } from "@lots-go/i18n";
import type {
  AttributeDetailsOutput,
  AttributeListItemOutput,
  CategoriesTreeOutput,
  CategoryAttributesOutput,
  CategoryDetailsOutput,
  PaginatedList,
} from "@lots-go/api-client";

import { apiClient } from "@/lib/api";

export const categoriesTreeQuery = (locale: Locale) =>
  queryOptions<CategoriesTreeOutput>({
    queryKey: ["categories", "tree", locale],
    queryFn: () => apiClient.getCategoryTree({ locale }),
  });

export const categoryDetailQuery = (id: string, locale: Locale) =>
  queryOptions<CategoryDetailsOutput>({
    queryKey: ["categories", id, locale],
    queryFn: () => apiClient.getCategoryById(id, { locale }),
  });

export const categoryAttributesQuery = (id: string, locale: Locale) =>
  queryOptions<CategoryAttributesOutput>({
    queryKey: ["categories", id, "attributes", locale],
    queryFn: () => apiClient.getCategoryAttributes(id, { locale }),
  });

export const attributesListQuery = (
  params: { page: number; pageSize: number },
  locale: Locale,
) =>
  queryOptions<PaginatedList<AttributeListItemOutput>>({
    queryKey: ["attributes", "list", params, locale],
    queryFn: () => apiClient.listAttributes(params, { locale }),
  });

export const attributeDetailQuery = (id: string, locale: Locale) =>
  queryOptions<AttributeDetailsOutput>({
    queryKey: ["attributes", id, locale],
    queryFn: () => apiClient.getAttributeById(id, { locale }),
  });
