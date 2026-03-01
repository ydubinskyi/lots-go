package request

import (
	"backend/internal/database"
	"context"
	"net/http"
	"strings"
)

// TODO: move to env variables
const (
	DefaultLocale = database.LanguageCodeEn
)

const localeContextKey = "locale"

func LocaleFromHeaders(headers http.Header) database.LanguageCode {
	locale := normalizeLocale(headers.Get("X-Locale"))
	if locale != "" {
		return locale
	}

	return DefaultLocale
}

func WithLocale(ctx context.Context, locale database.LanguageCode) context.Context {
	return context.WithValue(ctx, localeContextKey, locale)
}

func LocaleFromContext(ctx context.Context) database.LanguageCode {
	if locale, ok := ctx.Value(localeContextKey).(string); ok && locale != "" {
		return database.LanguageCode(locale)
	}

	return DefaultLocale
}

func normalizeLocale(value string) database.LanguageCode {
	value = strings.ToLower(strings.TrimSpace(value))
	if value == "" {
		return ""
	}

	localeStr := strings.Split(value, "-")[0]

	return database.LanguageCode(localeStr)
}
