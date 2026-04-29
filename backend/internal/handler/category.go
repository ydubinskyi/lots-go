package handler

import (
	"backend/internal/dto"
	"backend/internal/request"
	"backend/internal/response"
	"backend/internal/service"
	"errors"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type CategoryHandler struct {
	svc *service.CategoryService
}

func NewCategoryHandler(svc *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{svc: svc}
}

func (h *CategoryHandler) Routes(r chi.Router) {
	r.Post("/", h.CreateCategory)
	r.Get("/{id}", h.GetCategoryById)
	r.Get("/tree", h.GetCategoriesTree)
}

func (h *CategoryHandler) CreateCategory(w http.ResponseWriter, r *http.Request) {
	var input dto.CreateCategoryInput
	if err := request.DecodeAndValidate(r, &input); err != nil {
		response.BadRequest(w, r, err)
		return
	}

	cat, err := h.svc.Create(r.Context(), input)
	if err != nil {
		response.BadRequest(w, r, err)
		return
	}

	response.Created(w, r, cat)
}

func (h *CategoryHandler) GetCategoryById(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		response.BadRequest(w, r, fmt.Errorf("invalid category id: must be UUID"))
		return
	}

	locale := request.LocaleFromContext(r.Context())

	cat, err := h.svc.GetById(r.Context(), id, locale)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrCategoryNotFound):
			response.NotFound(w, r, err)
		default:
			response.BadRequest(w, r, err)
		}
		return
	}

	response.OK(w, r, dto.CategoryDetailsOutput{
		ID:           cat.ID,
		ParentID:     cat.ParentID,
		Depth:        cat.Depth,
		SortOrder:    cat.SortOrder,
		Translations: cat.Translations,
	})
}

func (h *CategoryHandler) GetCategoriesTree(w http.ResponseWriter, r *http.Request) {
	locale := request.LocaleFromContext(r.Context())

	result, err := h.svc.GetItemsTree(r.Context(), locale)
	if err != nil {
		response.BadRequest(w, r, err)
	}

	response.OK(w, r, result)
}
