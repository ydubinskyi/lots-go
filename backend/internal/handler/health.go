package handler

import (
	"backend/internal/response"
	"backend/internal/service"
	"net/http"
)

type HealthHandler struct {
	svc *service.HealthService
}

func NewHealthHandler(svc *service.HealthService) *HealthHandler {
	return &HealthHandler{
		svc: svc,
	}
}

func (h *HealthHandler) Check(w http.ResponseWriter, r *http.Request) {
	response.OK(w, r, h.svc.CheckDbHealth())
}
