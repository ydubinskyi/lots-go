package app_middleware

import (
	"backend/internal/request"
	"net/http"
)

func Locale(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		locale := request.LocaleFromHeaders(r.Header)
		ctx := request.WithLocale(r.Context(), locale)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
