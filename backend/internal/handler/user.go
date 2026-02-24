package handler

import (
	"backend/internal/response"
	"backend/internal/service"
	"net/http"

	"github.com/go-chi/chi/v5"
)

type UserHandler struct {
	svc *service.UserService
}

func NewUserHandler(svc *service.UserService) *UserHandler {
	return &UserHandler{svc: svc}
}

func (h *UserHandler) Routes(r chi.Router) {
	r.Get("/", h.GetUsers)
}

func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	response.OK(w, r, map[string]bool{"success": true})
}
