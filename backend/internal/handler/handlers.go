package handler

import "backend/internal/service"

type Handlers struct {
	Health   *HealthHandler
	User     *UserHandler
	Category *CategoryHandler
}

func NewHandlers(svcs *service.Services) *Handlers {
	return &Handlers{
		Health:   NewHealthHandler(svcs.Health),
		User:     NewUserHandler(svcs.User),
		Category: NewCategoryHandler(svcs.Category),
	}
}
