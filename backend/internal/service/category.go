package service

import (
	"backend/internal/database"
	"backend/internal/dto"
	"context"
	"database/sql"

	"github.com/google/uuid"
)

type CategoryService struct {
	queries *database.Queries
	db      *sql.DB
}

func NewCategoryService(queries *database.Queries, db *sql.DB) *CategoryService {
	return &CategoryService{
		queries: queries,
		db:      db,
	}
}

func (s *CategoryService) Create(ctx context.Context, input dto.CreateCategoryInput) (dto.CreateCategoryOutput, error) {
	var depth int32 = 0

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return dto.CreateCategoryOutput{}, err
	}
	defer tx.Rollback()

	qtx := s.queries.WithTx(tx)

	cat, err := qtx.CreateCategory(ctx, database.CreateCategoryParams{
		ParentID:  input.ParentID,
		Depth:     depth,
		SortOrder: input.SortOrder,
	})
	if err != nil {
		return dto.CreateCategoryOutput{}, err
	}

	for _, t := range input.Translations {
		_, err := qtx.CreateCategoryTranslation(ctx, database.CreateCategoryTranslationParams{
			CategoryID:   cat.ID,
			LanguageCode: database.LanguageCode(t.LanguageCode),
			Title:        t.Title,
			Slug:         t.Slug,
		})
		if err != nil {
			return dto.CreateCategoryOutput{}, err
		}
	}

	if err := tx.Commit(); err != nil {
		return dto.CreateCategoryOutput{}, err
	}

	return dto.CreateCategoryOutput{
		ID:        cat.ID,
		ParentID:  cat.ParentID,
		Depth:     cat.Depth,
		SortOrder: cat.SortOrder,
	}, nil
}

func (s *CategoryService) GetById(ctx context.Context, id uuid.UUID, locale database.LanguageCode) (dto.CategoryDetailsOutput, error) {
	cat, err := s.queries.GetCategoryWithTranslation(ctx, database.GetCategoryWithTranslationParams{
		ID:           id,
		LanguageCode: locale,
	})

	if err != nil {
		return dto.CategoryDetailsOutput{}, err
	}

	return dto.CategoryDetailsOutput{
		ID:        cat.ID,
		ParentID:  cat.ParentID,
		Depth:     cat.Depth,
		SortOrder: cat.SortOrder,
		Title:     cat.Title,
		Slug:      cat.Slug,
	}, err
}
