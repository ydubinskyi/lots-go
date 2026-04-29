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
	cat, err := s.queries.GetCategory(ctx, id)

	if err != nil {
		return dto.CategoryDetailsOutput{}, ErrCategoryNotFound
	}

	catTrans, err := s.queries.GetCategoryTranslations(ctx, cat.ID)

	if err != nil || len(catTrans) == 0 {
		return dto.CategoryDetailsOutput{}, ErrCategoryNotFound
	}

	formattedTranslations := make([]dto.CategoryTranslationOutput, 0, len(catTrans))
	for _, t := range catTrans {
		formattedTranslations = append(formattedTranslations, dto.CategoryTranslationOutput{
			ID:           t.ID,
			LanguageCode: string(t.LanguageCode),
			Title:        t.Title,
			Slug:         t.Slug,
			FullSlug:     t.FullSlug,
		})
	}

	return dto.CategoryDetailsOutput{
		ID:           cat.ID,
		ParentID:     cat.ParentID,
		Depth:        cat.Depth,
		SortOrder:    cat.SortOrder,
		Translations: formattedTranslations,
	}, nil
}

func (s *CategoryService) GetItemsTree(ctx context.Context, locale database.LanguageCode) (dto.CategoriesTreeOutput, error) {
	cats, err := s.queries.ListCategoriesWithTranslation(ctx, locale)
	if err != nil {
		return dto.CategoriesTreeOutput{}, err
	}

	return BuildCategoriesTree(cats), nil
}

func BuildCategoriesTree(rows []database.ListCategoriesWithTranslationRow) dto.CategoriesTreeOutput {
	if len(rows) == 0 {
		return dto.CategoriesTreeOutput{Items: nil}
	}

	// Pass 1: register every node by ID
	itemsMap := make(map[string]*dto.CategoryTreeItem, len(rows))
	for i := range rows {
		item := &rows[i]
		itemsMap[item.ID.String()] = &dto.CategoryTreeItem{
			ID:        item.ID,
			ParentID:  item.ParentID,
			Depth:     item.Depth,
			SortOrder: item.SortOrder,
			Title:     item.Title,
			Slug:      item.Slug,
			FullSlug:  item.FullSlug,
		}
	}

	// Pass 2: link children to parents; collect roots
	childrenMap := make(map[string][]*dto.CategoryTreeItem)
	var roots []*dto.CategoryTreeItem
	for i := range rows {
		item := &rows[i]
		node := itemsMap[item.ID.String()]
		if item.ParentID.Valid {
			parentKey := item.ParentID.UUID.String()
			childrenMap[parentKey] = append(childrenMap[parentKey], node)
		} else {
			roots = append(roots, node)
		}
	}

	// Recursive conversion: pointer tree -> value tree with all nested children
	var toValue func(node *dto.CategoryTreeItem) dto.CategoryTreeItem
	toValue = func(node *dto.CategoryTreeItem) dto.CategoryTreeItem {
		childPtrs := childrenMap[node.ID.String()]

		children := make([]dto.CategoryTreeItem, 0, len(childPtrs))
		for _, child := range childPtrs {
			children = append(children, toValue(child))
		}
		result := *node
		result.Children = children
		return result
	}

	items := make([]dto.CategoryTreeItem, 0, len(roots))
	for _, r := range roots {
		items = append(items, toValue(r))
	}
	return dto.CategoriesTreeOutput{Items: items}
}
