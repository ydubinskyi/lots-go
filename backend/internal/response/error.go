package response

import (
	"net/http"

	"github.com/go-chi/render"
)

type ErrResponse struct {
	Err            error  `json:"-"`
	HTTPStatusCode int    `json:"-"`
	StatusText     string `json:"status"`
	ErrorText      string `json:"error,omitempty"`
}

func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

func BadRequest(w http.ResponseWriter, r *http.Request, err error) {
	render.Render(w, r, &ErrResponse{
		Err:            err,
		HTTPStatusCode: http.StatusBadRequest,
		StatusText:     "Bad request.",
		ErrorText:      err.Error(),
	})
}

func Unauthorized(w http.ResponseWriter, r *http.Request, err error) {
	render.Render(w, r, &ErrResponse{
		Err:            err,
		HTTPStatusCode: http.StatusUnauthorized,
		StatusText:     "Unauthorized.",
		ErrorText:      err.Error(),
	})
}

func Forbidden(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, &ErrResponse{
		HTTPStatusCode: http.StatusForbidden,
		StatusText:     "Forbidden.",
	})
}

func NotFound(w http.ResponseWriter, r *http.Request) {
	render.Render(w, r, &ErrResponse{
		HTTPStatusCode: http.StatusNotFound,
		StatusText:     "Resource not found.",
	})
}

func Internal(w http.ResponseWriter, r *http.Request, err error) {
	render.Render(w, r, &ErrResponse{
		Err:            err,
		HTTPStatusCode: http.StatusInternalServerError,
		StatusText:     "Internal server error.",
	})
}

func Conflict(w http.ResponseWriter, r *http.Request, err error) {
	render.Render(w, r, &ErrResponse{
		Err:            err,
		HTTPStatusCode: http.StatusConflict,
		StatusText:     "Conflict.",
		ErrorText:      err.Error(),
	})
}

func Unprocessable(w http.ResponseWriter, r *http.Request, err error) {
	render.Render(w, r, &ErrResponse{
		Err:            err,
		HTTPStatusCode: http.StatusUnprocessableEntity,
		StatusText:     "Unprocessable entity.",
		ErrorText:      err.Error(),
	})
}
