package service

import (
	"backend/internal/database"
	"database/sql"
)

type Services struct {
	Health   *HealthService
	User     *UserService
	Category *CategoryService
}

func NewServices(queries *database.Queries, db *sql.DB) *Services {
	return &Services{
		Health:   NewHealthService(db),
		User:     NewUserService(queries, db),
		Category: NewCategoryService(queries, db),
	}
}
