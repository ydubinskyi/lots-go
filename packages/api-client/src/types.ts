export type UUID = string

// Go's uuid.NullUUID serializes via encoding/json as { UUID, Valid }.
export type NullUUID = { UUID: UUID; Valid: boolean }

export const nullUUID = (n: NullUUID): UUID | null => (n.Valid ? n.UUID : null)

export type Locale = "en" | "pl" | "uk"

export interface PaginatedList<T> {
  items: T[]
  total: number
  page: number
  // Backend emits camelCase here, snake_case elsewhere — mirroring exactly.
  pageSize: number
}

export interface CategoryTreeItem {
  id: UUID
  parent_id: NullUUID
  depth: number
  sort_order: number
  title: string
  slug: string
  full_slug: string
  children: CategoryTreeItem[]
}

export interface CategoriesTreeOutput {
  items: CategoryTreeItem[]
}

export interface CategoryTranslationOutput {
  id: UUID
  language_code: string
  title: string
  slug: string
  full_slug: string
}

export interface CategoryDetailsOutput {
  id: UUID
  parent_id: NullUUID
  depth: number
  sort_order: number
  translations: CategoryTranslationOutput[]
}

export interface CategoryAttributeOutput {
  id: UUID
  code: string
  label: string
  slug: string
  sort_order: number
  is_required: boolean
}

export interface CategoryAttributesOutput {
  items: CategoryAttributeOutput[]
}

export interface AttributeListItemOutput {
  id: UUID
  code: string
  label: string
  slug: string
}

export interface AttributeTranslationOutput {
  id: UUID
  language_code: string
  label: string
  slug: string
}

export interface AttributeDetailsOutput {
  id: UUID
  code: string
  translations: AttributeTranslationOutput[]
}

export interface CreateCategoryTranslationInput {
  language_code: string
  title: string
  slug: string
}

export interface CreateCategoryInput {
  parent_id?: NullUUID
  sort_order: number
  translations: CreateCategoryTranslationInput[]
}

export interface CreateCategoryOutput {
  id: UUID
  parent_id: NullUUID
  depth: number
  sort_order: number
}

export interface AttachAttributeInput {
  sort_order: number
  is_required: boolean
}

export interface CreateAttributeTranslationInput {
  language_code: string
  label: string
  slug: string
}

export interface CreateAttributeInput {
  code: string
  translations: CreateAttributeTranslationInput[]
}

export interface CreateAttributeOutput {
  id: UUID
  code: string
}

export interface ApiErrorBody {
  status: string
  error?: string
}
