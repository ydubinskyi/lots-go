import { ApiError, ApiNetworkError } from "./errors.ts";

import type {
  AttachAttributeInput,
  AttributeDetailsOutput,
  AttributeListItemOutput,
  CategoriesTreeOutput,
  CategoryAttributesOutput,
  CategoryDetailsOutput,
  CreateAttributeInput,
  CreateAttributeOutput,
  CreateCategoryInput,
  CreateCategoryOutput,
  Locale,
  PaginatedList,
  UUID,
} from "./types.ts";

type FetchLike = typeof fetch;

export interface ApiClientConfig {
  baseUrl: string;
  getLocale?: () => Locale | undefined;
  fetch?: FetchLike;
}

interface RequestOptions {
  locale?: Locale;
  signal?: AbortSignal;
}

interface ListAttributesParams {
  page?: number;
  pageSize?: number;
}

export interface ApiClient {
  getCategoryTree: (opts?: RequestOptions) => Promise<CategoriesTreeOutput>;
  getCategoryById: (id: UUID, opts?: RequestOptions) => Promise<CategoryDetailsOutput>;
  getCategoryAttributes: (id: UUID, opts?: RequestOptions) => Promise<CategoryAttributesOutput>;
  createCategory: (
    input: CreateCategoryInput,
    opts?: RequestOptions,
  ) => Promise<CreateCategoryOutput>;
  attachAttribute: (
    categoryId: UUID,
    attributeId: UUID,
    input: AttachAttributeInput,
    opts?: RequestOptions,
  ) => Promise<void>;
  detachAttribute: (categoryId: UUID, attributeId: UUID, opts?: RequestOptions) => Promise<void>;
  listAttributes: (
    params?: ListAttributesParams,
    opts?: RequestOptions,
  ) => Promise<PaginatedList<AttributeListItemOutput>>;
  getAttributeById: (id: UUID, opts?: RequestOptions) => Promise<AttributeDetailsOutput>;
  createAttribute: (
    input: CreateAttributeInput,
    opts?: RequestOptions,
  ) => Promise<CreateAttributeOutput>;
  getCurrentUser: () => Promise<null>;
}

export function createApiClient(cfg: ApiClientConfig): ApiClient {
  const f: FetchLike = cfg.fetch ?? fetch;
  const base = cfg.baseUrl.replace(/\/+$/, "");

  async function request<T>(
    path: string,
    init: RequestInit & { locale?: Locale } = {},
  ): Promise<T> {
    const locale = init.locale ?? cfg.getLocale?.() ?? "en";
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    headers.set("X-Locale", locale);
    if (init.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    let res: Response;
    try {
      res = await f(`${base}${path}`, { ...init, headers });
    } catch (cause) {
      throw new ApiNetworkError(cause);
    }

    if (!res.ok) {
      const body = (await res.json().catch(() => ({ status: res.statusText }))) as {
        status?: string;
        error?: string;
      };
      throw new ApiError(res.status, {
        status: body.status ?? res.statusText,
        error: body.error,
      });
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  function qs(params: Record<string, string | number | undefined>): string {
    const entries = Object.entries(params).filter(([, v]) => v !== undefined);
    if (entries.length === 0) return "";
    const sp = new URLSearchParams(entries.map(([k, v]) => [k, String(v)]));
    return `?${sp.toString()}`;
  }

  return {
    getCategoryTree: (opts) =>
      request<CategoriesTreeOutput>("/categories/tree", {
        signal: opts?.signal,
        locale: opts?.locale,
      }),

    getCategoryById: (id, opts) =>
      request<CategoryDetailsOutput>(`/categories/${id}`, {
        signal: opts?.signal,
        locale: opts?.locale,
      }),

    getCategoryAttributes: (id, opts) =>
      request<CategoryAttributesOutput>(`/categories/${id}/attributes`, {
        signal: opts?.signal,
        locale: opts?.locale,
      }),

    createCategory: (input, opts) =>
      request<CreateCategoryOutput>("/categories", {
        method: "POST",
        body: JSON.stringify(input),
        signal: opts?.signal,
        locale: opts?.locale,
      }),

    attachAttribute: (categoryId, attributeId, input, opts) =>
      request<void>(`/categories/${categoryId}/attributes/${attributeId}`, {
        method: "POST",
        body: JSON.stringify(input),
        signal: opts?.signal,
        locale: opts?.locale,
      }),

    detachAttribute: (categoryId, attributeId, opts) =>
      request<void>(`/categories/${categoryId}/attributes/${attributeId}`, {
        method: "DELETE",
        signal: opts?.signal,
        locale: opts?.locale,
      }),

    listAttributes: (params, opts) =>
      request<PaginatedList<AttributeListItemOutput>>(
        `/attributes${qs({ page: params?.page, pageSize: params?.pageSize })}`,
        { signal: opts?.signal, locale: opts?.locale },
      ),

    getAttributeById: (id, opts) =>
      request<AttributeDetailsOutput>(`/attributes/${id}`, {
        signal: opts?.signal,
        locale: opts?.locale,
      }),

    createAttribute: (input, opts) =>
      request<CreateAttributeOutput>("/attributes", {
        method: "POST",
        body: JSON.stringify(input),
        signal: opts?.signal,
        locale: opts?.locale,
      }),

    getCurrentUser: () => Promise.resolve(null),
  };
}
