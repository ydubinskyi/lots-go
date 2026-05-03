package service

import (
	"backend/internal/database"
	"backend/internal/dto"
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
)

type AttributeService struct {
	queries *database.Queries
	db      *sql.DB
}

func NewAttributeService(queries *database.Queries, db *sql.DB) *AttributeService {
	return &AttributeService{
		queries: queries,
		db:      db,
	}
}

func (s *AttributeService) Create(ctx context.Context, input dto.CreateAttributeInput) (dto.CreateAttributeOutput, error) {
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return dto.CreateAttributeOutput{}, err
	}
	defer tx.Rollback()

	qtx := s.queries.WithTx(tx)

	attr, err := qtx.CreateAttribute(ctx, input.Code)
	if err != nil {
		return dto.CreateAttributeOutput{}, err
	}

	for _, t := range input.Translations {
		_, err := qtx.CreateAttributeTranslation(ctx, database.CreateAttributeTranslationParams{
			AttributeID:  attr.ID,
			LanguageCode: database.LanguageCode(t.LanguageCode),
			Label:        t.Label,
			Slug:         t.Slug,
		})
		if err != nil {
			return dto.CreateAttributeOutput{}, err
		}
	}

	if err := tx.Commit(); err != nil {
		return dto.CreateAttributeOutput{}, err
	}

	return dto.CreateAttributeOutput{
		ID:   attr.ID,
		Code: attr.Code,
	}, nil
}

func (s *AttributeService) GetById(ctx context.Context, id uuid.UUID) (dto.AttributeDetailsOutput, error) {
	attr, err := s.queries.GetAttribute(ctx, id)
	if err != nil {
		return dto.AttributeDetailsOutput{}, ErrAttributeNotFound
	}

	trans, err := s.queries.GetAttributeTranslations(ctx, attr.ID)
	if err != nil || len(trans) == 0 {
		return dto.AttributeDetailsOutput{}, ErrAttributeNotFound
	}

	formatted := make([]dto.AttributeTranslationOutput, 0, len(trans))
	for _, t := range trans {
		formatted = append(formatted, dto.AttributeTranslationOutput{
			ID:           t.ID,
			LanguageCode: string(t.LanguageCode),
			Label:        t.Label,
			Slug:         t.Slug,
		})
	}

	return dto.AttributeDetailsOutput{
		ID:           attr.ID,
		Code:         attr.Code,
		Translations: formatted,
	}, nil
}

func (s *AttributeService) List(ctx context.Context, locale database.LanguageCode, page, pageSize int32) (dto.PaginatedListOutput[dto.AttributeListItemOutput], error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}

	rows, err := s.queries.ListAttributesWithTranslation(ctx, database.ListAttributesWithTranslationParams{
		LanguageCode: locale,
		Limit:        pageSize,
		Offset:       (page - 1) * pageSize,
	})
	if err != nil {
		return dto.PaginatedListOutput[dto.AttributeListItemOutput]{}, err
	}

	total, err := s.queries.CountAttributes(ctx)
	if err != nil {
		return dto.PaginatedListOutput[dto.AttributeListItemOutput]{}, err
	}

	items := make([]dto.AttributeListItemOutput, 0, len(rows))
	for _, r := range rows {
		items = append(items, dto.AttributeListItemOutput{
			ID:    r.ID,
			Code:  r.Code,
			Label: r.Label,
			Slug:  r.Slug,
		})
	}

	return dto.PaginatedListOutput[dto.AttributeListItemOutput]{
		Items:    items,
		Total:    total,
		Page:     page,
		PageSize: pageSize,
	}, nil
}

func (s *AttributeService) AttachToCategory(ctx context.Context, categoryID, attributeID uuid.UUID, input dto.AttachAttributeToCategoryInput) error {
	if _, err := s.queries.GetCategory(ctx, categoryID); err != nil {
		return ErrCategoryNotFound
	}
	if _, err := s.queries.GetAttribute(ctx, attributeID); err != nil {
		return ErrAttributeNotFound
	}

	_, err := s.queries.AttachAttributeToCategory(ctx, database.AttachAttributeToCategoryParams{
		CategoryID:  categoryID,
		AttributeID: attributeID,
		SortOrder:   input.SortOrder,
		IsRequired:  input.IsRequired,
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ErrAttributeAlreadyAttached
		}
		return err
	}
	return nil
}

func (s *AttributeService) DetachFromCategory(ctx context.Context, categoryID, attributeID uuid.UUID) error {
	rows, err := s.queries.DetachAttributeFromCategory(ctx, database.DetachAttributeFromCategoryParams{
		CategoryID:  categoryID,
		AttributeID: attributeID,
	})
	if err != nil {
		return err
	}
	if rows == 0 {
		return ErrAttributeNotAttached
	}
	return nil
}

func (s *AttributeService) GetEffectiveForCategory(ctx context.Context, categoryID uuid.UUID, locale database.LanguageCode) (dto.CategoryAttributesOutput, error) {
	if _, err := s.queries.GetCategory(ctx, categoryID); err != nil {
		return dto.CategoryAttributesOutput{}, ErrCategoryNotFound
	}

	rows, err := s.queries.GetCategoryEffectiveAttributes(ctx, database.GetCategoryEffectiveAttributesParams{
		ID:           categoryID,
		LanguageCode: locale,
	})
	if err != nil {
		return dto.CategoryAttributesOutput{}, err
	}

	items := make([]dto.CategoryAttributeOutput, 0, len(rows))
	for _, r := range rows {
		items = append(items, dto.CategoryAttributeOutput{
			ID:         r.ID,
			Code:       r.Code,
			Label:      r.Label,
			Slug:       r.Slug,
			SortOrder:  r.SortOrder,
			IsRequired: r.IsRequired,
		})
	}

	return dto.CategoryAttributesOutput{Items: items}, nil
}
