package service

import (
	"backend/internal/database"
	"context"
	"database/sql"
)

type UserService struct {
	queries *database.Queries
	db      *sql.DB
}

func NewUserService(queries *database.Queries, db *sql.DB) *UserService {
	return &UserService{
		queries: queries,
		db:      db,
	}
}

func (s *UserService) GetByEmail(ctx context.Context, email string) (database.User, error) {
	return s.queries.GetUserByEmail(ctx, email)
}
