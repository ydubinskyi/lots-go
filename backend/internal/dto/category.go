package dto

import (
	"github.com/google/uuid"
)

type CreateCategoryTranslationInput struct {
	LanguageCode string `json:"language_code" validate:"required,bcp47_language_tag"`
	Title        string `json:"title"         validate:"required,min=1,max=255"`
	Slug         string `json:"slug"          validate:"required,min=1,max=255"`
}

type CreateCategoryInput struct {
	ParentID     uuid.NullUUID                    `json:"parent_id"`
	SortOrder    int32                            `json:"sort_order"    validate:"min=0"`
	Translations []CreateCategoryTranslationInput `json:"translations"  validate:"required,min=1,dive"`
}

type CreateCategoryOutput struct {
	ID        uuid.UUID     `json:"id"`
	ParentID  uuid.NullUUID `json:"parent_id"`
	Depth     int32         `json:"depth"`
	SortOrder int32         `json:"sort_order"`
}

type CategoryTranslationOutput struct {
	ID           uuid.UUID `json:"id"`
	LanguageCode string    `json:"language_code"`
	Title        string    `json:"title"`
	Slug         string    `json:"slug"`
	FullSlug     string    `json:"full_slug"`
}

type CategoryDetailsOutput struct {
	ID           uuid.UUID                   `json:"id"`
	ParentID     uuid.NullUUID               `json:"parent_id"`
	Depth        int32                       `json:"depth"`
	SortOrder    int32                       `json:"sort_order"`
	Translations []CategoryTranslationOutput `json:"translations"`
}

type CategoryTreeItem struct {
	ID        uuid.UUID          `json:"id"`
	ParentID  uuid.NullUUID      `json:"parent_id"`
	Depth     int32              `json:"depth"`
	SortOrder int32              `json:"sort_order"`
	Title     string             `json:"title"`
	Slug      string             `json:"slug"`
	FullSlug  string             `json:"full_slug"`
	Children  []CategoryTreeItem `json:"children"`
}

type CategoriesTreeOutput struct {
	Items []CategoryTreeItem `json:"items"`
}
