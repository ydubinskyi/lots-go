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
	svc     *service.CategoryService
	attrSvc *service.AttributeService
}

func NewCategoryHandler(svc *service.CategoryService, attrSvc *service.AttributeService) *CategoryHandler {
	return &CategoryHandler{svc: svc, attrSvc: attrSvc}
}

func (h *CategoryHandler) Routes(r chi.Router) {
	r.Post("/", h.CreateCategory)
	r.Get("/{id}", h.GetCategoryById)
	r.Get("/tree", h.GetCategoriesTree)

	r.Get("/{id}/attributes", h.GetCategoryAttributes)
	r.Post("/{id}/attributes/{attributeID}", h.AttachAttribute)
	r.Delete("/{id}/attributes/{attributeID}", h.DetachAttribute)
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

func (h *CategoryHandler) GetCategoryAttributes(w http.ResponseWriter, r *http.Request) {
	id, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.BadRequest(w, r, fmt.Errorf("invalid category id: must be UUID"))
		return
	}

	locale := request.LocaleFromContext(r.Context())

	out, err := h.attrSvc.GetEffectiveForCategory(r.Context(), id, locale)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrCategoryNotFound):
			response.NotFound(w, r, err)
		default:
			response.BadRequest(w, r, err)
		}
		return
	}

	response.OK(w, r, out)
}

func (h *CategoryHandler) AttachAttribute(w http.ResponseWriter, r *http.Request) {
	categoryID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.BadRequest(w, r, fmt.Errorf("invalid category id: must be UUID"))
		return
	}
	attributeID, err := uuid.Parse(chi.URLParam(r, "attributeID"))
	if err != nil {
		response.BadRequest(w, r, fmt.Errorf("invalid attribute id: must be UUID"))
		return
	}

	var input dto.AttachAttributeToCategoryInput
	if err := request.DecodeAndValidate(r, &input); err != nil {
		response.BadRequest(w, r, err)
		return
	}

	if err := h.attrSvc.AttachToCategory(r.Context(), categoryID, attributeID, input); err != nil {
		switch {
		case errors.Is(err, service.ErrCategoryNotFound), errors.Is(err, service.ErrAttributeNotFound):
			response.NotFound(w, r, err)
		case errors.Is(err, service.ErrAttributeAlreadyAttached):
			response.Conflict(w, r, err)
		default:
			response.BadRequest(w, r, err)
		}
		return
	}

	response.Created(w, r, map[string]any{
		"category_id":  categoryID,
		"attribute_id": attributeID,
		"sort_order":   input.SortOrder,
		"is_required":  input.IsRequired,
	})
}

func (h *CategoryHandler) DetachAttribute(w http.ResponseWriter, r *http.Request) {
	categoryID, err := uuid.Parse(chi.URLParam(r, "id"))
	if err != nil {
		response.BadRequest(w, r, fmt.Errorf("invalid category id: must be UUID"))
		return
	}
	attributeID, err := uuid.Parse(chi.URLParam(r, "attributeID"))
	if err != nil {
		response.BadRequest(w, r, fmt.Errorf("invalid attribute id: must be UUID"))
		return
	}

	if err := h.attrSvc.DetachFromCategory(r.Context(), categoryID, attributeID); err != nil {
		switch {
		case errors.Is(err, service.ErrAttributeNotAttached):
			response.NotFound(w, r, err)
		default:
			response.BadRequest(w, r, err)
		}
		return
	}

	response.NoContent(w, r)
}
