package handler

import (
	"backend/internal/dto"
	"backend/internal/request"
	"backend/internal/response"
	"backend/internal/service"
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
)

type AttributeHandler struct {
	svc *service.AttributeService
}

func NewAttributeHandler(svc *service.AttributeService) *AttributeHandler {
	return &AttributeHandler{svc: svc}
}

func (h *AttributeHandler) Routes(r chi.Router) {
	r.Post("/", h.CreateAttribute)
	r.Get("/", h.ListAttributes)
	r.Get("/{id}", h.GetAttributeById)
}

func (h *AttributeHandler) CreateAttribute(w http.ResponseWriter, r *http.Request) {
	var input dto.CreateAttributeInput
	if err := request.DecodeAndValidate(r, &input); err != nil {
		response.BadRequest(w, r, err)
		return
	}

	out, err := h.svc.Create(r.Context(), input)
	if err != nil {
		response.BadRequest(w, r, err)
		return
	}

	response.Created(w, r, out)
}

func (h *AttributeHandler) GetAttributeById(w http.ResponseWriter, r *http.Request) {
	idParam := chi.URLParam(r, "id")
	id, err := uuid.Parse(idParam)
	if err != nil {
		response.BadRequest(w, r, fmt.Errorf("invalid attribute id: must be UUID"))
		return
	}

	out, err := h.svc.GetById(r.Context(), id)
	if err != nil {
		switch {
		case errors.Is(err, service.ErrAttributeNotFound):
			response.NotFound(w, r, err)
		default:
			response.BadRequest(w, r, err)
		}
		return
	}

	response.OK(w, r, out)
}

func (h *AttributeHandler) ListAttributes(w http.ResponseWriter, r *http.Request) {
	locale := request.LocaleFromContext(r.Context())

	page := parseInt32Query(r, "page", 1)
	pageSize := parseInt32Query(r, "page_size", 20)

	out, err := h.svc.List(r.Context(), locale, page, pageSize)
	if err != nil {
		response.BadRequest(w, r, err)
		return
	}

	response.OK(w, r, out)
}

func parseInt32Query(r *http.Request, key string, fallback int32) int32 {
	raw := r.URL.Query().Get(key)
	if raw == "" {
		return fallback
	}
	v, err := strconv.ParseInt(raw, 10, 32)
	if err != nil || v < 1 {
		return fallback
	}
	return int32(v)
}
