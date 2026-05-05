# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a monorepo with a Go API in `backend/` and a JS/TS workspace at the root for one or more frontend apps:

```
backend/                  # Go API (chi + sqlc + Postgres) — independent toolchain
apps/
  web-tanstack/           # TanStack Start app (Vite). Next.js app to follow.
packages/
  ui/                     # shadcn components + shared <Link> primitive
  api-client/             # typed fetch wrapper for the Go API
package.json              # JS workspace root (pnpm + Turborepo)
pnpm-workspace.yaml
turbo.json
```

The Go module name is `backend`, so internal Go imports look like `backend/internal/...`. JS workspace packages are namespaced `@lots-go/*` (e.g. `@lots-go/ui`, `@lots-go/api-client`, `@lots-go/web-tanstack`). The two halves are independent — Turborepo orchestrates JS work; backend is built/tested via `make` only.

## Commands (backend)

All Go commands are run from `backend/`.

```bash
make run          # go run cmd/api/main.go
make watch        # live reload via air (auto-installs air on first run if missing)
make build        # produces ./main
make test         # go test ./... -v
make itest        # integration tests for the database layer only (./internal/database)

make docker-run   # start PostgreSQL via docker-compose (detached; doesn't block the shell)
make docker-down  # stop PostgreSQL

make migrate-up      # apply pending migrations (goose, versioned)
make migrate-down    # roll back the last migration
make migrate-status  # show applied/pending migrations

make seed-up      # apply seeds (goose, no-versioning mode)
make seed-down    # roll back the last seed
```

Run a single test: `cd backend && go test ./internal/service -run TestName -v`.

The `goose` binary picks up `GOOSE_DRIVER` / `GOOSE_DBSTRING` / `GOOSE_MIGRATION_DIR` from the shell environment — works directly if you have direnv (or have sourced `.env` yourself). If not, prefix with `set -a; . ./.env; set +a;` before invoking `goose` or any `make migrate-*` / `make seed-*` target.

Regenerate sqlc code after editing `internal/database/queries/*.sql` or `internal/database/migrations/*.sql`:

```bash
cd backend && sqlc generate     # config: backend/sqlc.yaml
```

**sqlc strictness gotchas** for queries Postgres would accept but sqlc rejects:

- **Recursive CTEs:** alias every table reference in the anchor query (`SELECT c.id FROM categories c WHERE c.id = $1`), not bare `id` — sqlc's parser flags `id` as ambiguous against the recursive name.
- **`ORDER BY` after multi-join translation fallback:** referencing the SELECT alias of a `COALESCE(t_req.col, t_def.col)` column in `ORDER BY` triggers "ambiguous column" because both join sources expose that name. Repeat the full `COALESCE(...)` expression in `ORDER BY`, or set `strict_order_by: false` in `sqlc.yaml`.

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
PORT=3000
APP_ENV=local
DB_URL=postgres://postgres:postgres@localhost:5432/lots_go?sslmode=disable
GOOSE_DRIVER=postgres
GOOSE_DBSTRING=${DB_URL}
GOOSE_MIGRATION_DIR=./internal/database/migrations
```

The `docker-compose.yml` PostgreSQL credentials are aligned with these defaults, so `make docker-run` + the example `.env` work together with no edits.

## Frontend — apps/web-tanstack

TanStack Start (SSR) + TanStack Router (file-based) + TanStack Query + TanStack Form + Tailwind v4 + shadcn (`radix-lyra` style).

```bash
pnpm --filter @lots-go/web-tanstack dev       # Vite dev server on :5173
pnpm --filter @lots-go/web-tanstack typecheck # tsc --noEmit
```

**Route tree generation** — `routeTree.gen.ts` is auto-generated by the Vite plugin on every dev/build start. There is no standalone CLI for it; start the dev server once to regenerate after adding or renaming route files.

**Adding shadcn components** — always run from `packages/ui` (that's where `components.json` points components):

```bash
cd packages/ui && npx shadcn@latest add <component>
```

After adding, strip any `"use client"` directives from the generated files — TanStack Start is not RSC, these directives cause no-ops at best and confusion at worst:

```bash
# quick audit:
grep -rl '"use client"' packages/ui/src/components/
```

The `sonner` component generated by shadcn imports `next-themes` which is not used in this project. `next-themes` has been removed from `packages/ui`. The sonner component has been rewritten as a standalone version — see `packages/ui/src/components/sonner.tsx` for the pattern. If shadcn regenerates it, revert to the standalone version.

## Frontend — key patterns

**TanStack Query setup** — singleton `QueryClient` lives in `apps/web-tanstack/src/lib/query-client.ts`. It is passed as router context in `router.tsx` so loaders can call `context.queryClient.ensureQueryData(...)`. The `<QueryClientProvider>` wraps the app in `__root.tsx`.

**Query factories** — always use `queryOptions<ReturnType>(...)` from `@tanstack/react-query` (not the generic `QueryOptions` type). The typed helper ensures `queryKey` is non-optional, which is required by both `ensureQueryData` and `useQuery`:

```ts
import { queryOptions } from "@tanstack/react-query";

export const myQuery = (id: string) =>
  queryOptions<MyOutput>({
    queryKey: ["my", id],
    queryFn: () => apiClient.getMyThing(id),
  });
```

**TanStack Form** — do not pass a type argument to `useForm<T>`. Let it infer from `defaultValues`:

```ts
// ✗ useForm<MyFormValues>({ ... })  — expects 12 type args, fails
// ✓
const form = useForm({ defaultValues: { ... } });
```

For dynamic field names (e.g. `translations[${index}].slug`), cast to a concrete sibling path to satisfy the type checker:

```ts
form.setFieldValue(`translations[${index}].slug` as "translations[0].slug", value);
```

**TanStack Router — same-route search param navigation** — use `to="."` in `<Link>` or `navigate` to stay on the current route with updated search, not the full route ID with trailing slash:

```tsx
// ✗ to="/{-$locale}/admin/attributes/"  — not accepted as a valid `to` from this route
// ✓
<RouterLink to="." search={{ page: page + 1, pageSize }}>
  Next
</RouterLink>
```

**TanStack Router — loader search params** — `LoaderFnContext` does not expose a `search` property. Routes with `validateSearch` receive parsed search in `{ search }` only in some contexts; the safest approach is to pass default values to the loader and let `useSearch()` drive client-side behaviour.
