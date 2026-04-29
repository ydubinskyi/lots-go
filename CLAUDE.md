# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a monorepo. Today it contains a single Go API in `backend/`; multiple frontend apps will be added at the repo root alongside it. There is no top-level build tool — each app manages its own toolchain. The Go module name is `backend`, so internal imports look like `backend/internal/...`.

## Commands (backend)

All Go commands are run from `backend/`.

```bash
make run          # go run cmd/api/main.go
make watch        # live reload via air (auto-installs air on first run if missing)
make build        # produces ./main
make test         # go test ./... -v
make itest        # integration tests for the database layer only (./internal/database)

make docker-run   # start PostgreSQL via docker-compose
make docker-down  # stop PostgreSQL

make seed-up      # apply seeds (goose, no-versioning mode)
make seed-down    # roll back the last seed
```

Run a single test: `cd backend && go test ./internal/service -run TestName -v`.

Migrations are not in the Makefile — run goose directly using vars from `.env`:

```bash
cd backend && source .env && goose -dir $GOOSE_MIGRATION_DIR $GOOSE_DRIVER $GOOSE_DBSTRING up
```

Regenerate sqlc code after editing `internal/database/queries/*.sql` or `internal/database/migrations/*.sql`:

```bash
cd backend && sqlc generate     # config: backend/sqlc.yaml
```

`.env` is auto-loaded by `github.com/joho/godotenv/autoload` (imported in `internal/server/server.go`); copy `.env.example` to `.env` to start.

## Architecture (backend)

Three-layer pipeline: **Handler → Service → Database**, wired together in `internal/server/server.go` and exposed via chi.

- `cmd/api/main.go` — entry point; wires graceful shutdown on `SIGINT`/`SIGTERM` with a 5s timeout.
- `internal/server/` — `NewServer()` opens the DB, builds `Queries`, then `Services`, then `Handlers`. `RegisterRoutes` mounts global middleware (`RequestID`, `Logger`, `Recoverer`, `URLFormat`, JSON content-type, custom `Locale`, CORS) and routes everything API-related under `/api/v1`. Health is at `/health` (outside the versioned API).
- `internal/handler/` — thin HTTP layer. Each handler owns its sub-routes via a `Routes(r chi.Router)` method that the server's main router calls (`r.Route("/categories", h.Category.Routes)`).
- `internal/service/` — business logic and transaction orchestration. Services are constructed with `(queries *database.Queries, db *sql.DB)`; the `*sql.DB` is kept around solely to call `BeginTx` for multi-statement work.
- `internal/database/` — sqlc-generated code (`*.sql.go`, `models.go`, `db.go`) plus the hand-written `db_connect.go` (opens via `pgx/v5/stdlib` + `database/sql`). **Never edit the generated files directly** — change the SQL in `queries/` or `migrations/` and re-run `sqlc generate`.
- `internal/dto/` — input/output structs at the handler↔service boundary. Includes a generic `PaginatedListOutput[T any]`.
- `internal/request/` — JSON decode + struct-tag validation (`go-playground/validator/v10`); also locale extraction (`LocaleFromHeaders`, `WithLocale`, `LocaleFromContext`).
- `internal/response/` — JSON helpers (`OK`, `Created`, `NoContent`) and error helpers (`BadRequest`, `Unauthorized`, `Forbidden`, `NotFound`, `Internal`, `Conflict`, `Unprocessable`).
- `internal/middleware/` — currently just `Locale`, which reads `X-Locale` and stashes the normalized code on the request context.

## Key patterns

**Request handling** (handler):

```go
var input dto.CreateXInput
if err := request.DecodeAndValidate(r, &input); err != nil {
    response.BadRequest(w, r, err)
    return
}
result, err := h.svc.Method(r.Context(), input)
if err != nil {
    switch {
    case errors.Is(err, service.ErrXNotFound):
        response.NotFound(w, r, err)
    default:
        response.BadRequest(w, r, err)
    }
    return
}
response.OK(w, r, result)
```

**Service-layer errors:** services expose sentinel errors in `internal/service/errors.go` (`ErrCategoryNotFound`, etc.). Handlers branch on them with `errors.Is` and pick the right HTTP response. Add new sentinels there rather than returning ad-hoc strings — the handler boundary is where domain errors become HTTP status codes.

**Database transactions:**

```go
tx, err := s.db.BeginTx(ctx, nil)
if err != nil { return ..., err }
defer tx.Rollback()
qtx := s.queries.WithTx(tx)
// ... use qtx for every statement that must be atomic ...
return ..., tx.Commit()
```

The `defer tx.Rollback()` is intentional and safe — it's a no-op once `Commit()` succeeds.

**Locale:** `X-Locale` header → lowercased + stripped of region (`en-US` → `en`) → stored on context → pulled via `request.LocaleFromContext` in handlers and passed into queries. Supported: `en`, `pl`, `uk` (the Postgres `language_code` ENUM and the generated `database.LanguageCode` type). Default is `en`.

**Translation fallback (SQL-side):** localized list/get queries (`GetCategoryWithTranslation`, `ListCategoriesWithTranslation`) double-join `category_translations` — once on the requested locale, once on `en` — and `COALESCE` the columns. The DB always returns a row even if the requested locale's translation is missing.

**Validation:** struct tags from `go-playground/validator/v10`. Note the `bcp47_language_tag` tag used on translation inputs.

**Soft delete:** rows have `deleted_at TIMESTAMP NULL`. Every read query filters `WHERE deleted_at IS NULL` — keep this convention when adding new queries against soft-deleted tables.

## Database

- PostgreSQL via `pgx/v5` driver registered with `database/sql`.
- Migrations: `backend/internal/database/migrations/` (goose, versioned).
- Seeds: `backend/internal/database/seed/` (goose, `--no-versioning`; safe to re-apply).
- Schema:
  - `users` — id, email (unique), hashed_password, timestamps.
  - `categories` — self-referential tree; DB constraints enforce `id != parent_id`, `depth >= 0`, and `depth <= 2` (root + two levels).
  - `category_translations` — per-language `title`, `slug`, and pre-computed `full_slug`; uniqueness on `(category_id, language_code)`. The `full_slug` is materialized rather than recomputed at query time.
- Tree assembly happens in Go (`service.BuildCategoriesTree`): two-pass — register all rows by ID, then attach children to parents — so the SQL stays a flat ordered list (`ORDER BY depth, sort_order`).

## Environment

Copy `backend/.env.example` to `backend/.env`. Keys:

```
PORT=8080
APP_ENV=local
DB_URL=postgres://postgres:postgres@localhost:5432/lots_go?sslmode=disable
GOOSE_DRIVER=postgres
GOOSE_DBSTRING=${DB_URL}
GOOSE_MIGRATION_DIR=./internal/database/migrations
```

The `docker-compose.yml` PostgreSQL credentials are aligned with these defaults, so `make docker-run` + the example `.env` work together with no edits.
