
-- name: CreateCategory :one
INSERT INTO categories (
    parent_id,
    depth,
    sort_order
) VALUES (
    $1, $2, $3
)
RETURNING *;

-- name: CreateCategoryTranslation :one
INSERT INTO category_translations (
    category_id,
    language_code,
    title,
    slug
) VALUES (
    $1, $2, $3, $4
)
RETURNING *;


-- name: GetCategory :one
SELECT * FROM categories
WHERE id = $1
  AND deleted_at IS NULL;

-- name: GetCategoryTranslation :one
SELECT * FROM category_translations
WHERE category_id = $1
  AND language_code = $2
  AND deleted_at IS NULL;

-- name: GetCategoryWithTranslation :one
SELECT 
    c.id,
    c.parent_id,
    c.depth,
    c.sort_order,
    c.created_at,
    c.updated_at,
    COALESCE(t_req.title, t_def.title) as title,
    COALESCE(t_req.slug, t_def.slug) as slug,
    COALESCE(t_req.language_code, t_def.language_code) as language_code,
    CASE 
        WHEN t_req.title IS NOT NULL THEN t_req.language_code
        ELSE t_def.language_code
    END as resolved_language
FROM categories c
LEFT JOIN category_translations t_req 
    ON c.id = t_req.category_id 
    AND t_req.language_code = $2
    AND t_req.deleted_at IS NULL
LEFT JOIN category_translations t_def 
    ON c.id = t_def.category_id 
    AND t_def.language_code = 'en'
    AND t_def.deleted_at IS NULL
WHERE c.id = $1
  AND c.deleted_at IS NULL;

-- name: ListCategories :many
SELECT * FROM categories
WHERE deleted_at IS NULL
ORDER BY depth, sort_order
LIMIT $1 OFFSET $2;

-- name: ListCategoriesWithTranslation :many
SELECT 
    c.id,
    c.parent_id,
    c.depth,
    c.sort_order,
    c.created_at,
    c.updated_at,
    COALESCE(t_req.title, t_def.title) as title,
    COALESCE(t_req.slug, t_def.slug) as slug
FROM categories c
LEFT JOIN category_translations t_req 
    ON c.id = t_req.category_id 
    AND t_req.language_code = $1
    AND t_req.deleted_at IS NULL
LEFT JOIN category_translations t_def 
    ON c.id = t_def.category_id 
    AND t_def.language_code = 'en'
    AND t_def.deleted_at IS NULL
WHERE c.deleted_at IS NULL
ORDER BY c.depth, c.sort_order
LIMIT $2 OFFSET $3;