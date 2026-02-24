package response

import (
	"net/http"

	"github.com/go-chi/render"
)

func JSON(w http.ResponseWriter, r *http.Request, status int, data any) {
	render.Status(r, status)
	render.JSON(w, r, data)
}

func OK(w http.ResponseWriter, r *http.Request, data any) {
	JSON(w, r, http.StatusOK, data)
}

func Created(w http.ResponseWriter, r *http.Request, data any) {
	JSON(w, r, http.StatusCreated, data)
}

func NoContent(w http.ResponseWriter, r *http.Request) {
	render.NoContent(w, r)
}
