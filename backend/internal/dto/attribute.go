package dto

import (
	"github.com/google/uuid"
)

type CreateAttributeTranslationInput struct {
	LanguageCode string `json:"language_code" validate:"required,bcp47_language_tag"`
	Label        string `json:"label"         validate:"required,min=1,max=255"`
	Slug         string `json:"slug"          validate:"required,min=1,max=255"`
}

type CreateAttributeInput struct {
	Code         string                            `json:"code"         validate:"required,min=1,max=64"`
	Translations []CreateAttributeTranslationInput `json:"translations" validate:"required,min=1,dive"`
}

type AttachAttributeToCategoryInput struct {
	SortOrder  int32 `json:"sort_order"  validate:"min=0"`
	IsRequired bool  `json:"is_required"`
}

type CreateAttributeOutput struct {
	ID   uuid.UUID `json:"id"`
	Code string    `json:"code"`
}

type AttributeTranslationOutput struct {
	ID           uuid.UUID `json:"id"`
	LanguageCode string    `json:"language_code"`
	Label        string    `json:"label"`
	Slug         string    `json:"slug"`
}

type AttributeDetailsOutput struct {
	ID           uuid.UUID                    `json:"id"`
	Code         string                       `json:"code"`
	Translations []AttributeTranslationOutput `json:"translations"`
}

type AttributeListItemOutput struct {
	ID    uuid.UUID `json:"id"`
	Code  string    `json:"code"`
	Label string    `json:"label"`
	Slug  string    `json:"slug"`
}

type CategoryAttributeOutput struct {
	ID         uuid.UUID `json:"id"`
	Code       string    `json:"code"`
	Label      string    `json:"label"`
	Slug       string    `json:"slug"`
	SortOrder  int32     `json:"sort_order"`
	IsRequired bool      `json:"is_required"`
}

type CategoryAttributesOutput struct {
	Items []CategoryAttributeOutput `json:"items"`
}
