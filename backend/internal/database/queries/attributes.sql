
-- name: CreateAttribute :one
INSERT INTO attributes (
    code
) VALUES (
    $1
)
RETURNING *;

-- name: CreateAttributeTranslation :one
INSERT INTO attribute_translations (
    attribute_id,
    language_code,
    label,
    slug
) VALUES (
    $1, $2, $3, $4
)
RETURNING *;

-- name: GetAttribute :one
SELECT * FROM attributes
WHERE id = $1
  AND deleted_at IS NULL;

-- name: GetAttributeTranslations :many
SELECT * FROM attribute_translations
WHERE attribute_id = $1
  AND deleted_at IS NULL;

-- name: ListAttributesWithTranslation :many
SELECT
    a.id,
    a.code,
    a.created_at,
    a.updated_at,
    COALESCE(t_req.label, t_def.label) AS label,
    COALESCE(t_req.slug,  t_def.slug)  AS slug
FROM attributes a
LEFT JOIN attribute_translations t_req
    ON a.id = t_req.attribute_id
    AND t_req.language_code = $1
    AND t_req.deleted_at IS NULL
LEFT JOIN attribute_translations t_def
    ON a.id = t_def.attribute_id
    AND t_def.language_code = 'en'
    AND t_def.deleted_at IS NULL
WHERE a.deleted_at IS NULL
ORDER BY a.code
LIMIT $2 OFFSET $3;

-- name: CountAttributes :one
SELECT COUNT(*) FROM attributes
WHERE deleted_at IS NULL;

-- name: AttachAttributeToCategory :one
INSERT INTO category_attributes (
    category_id,
    attribute_id,
    sort_order,
    is_required
) VALUES (
    $1, $2, $3, $4
)
ON CONFLICT (category_id, attribute_id) DO NOTHING
RETURNING *;

-- name: DetachAttributeFromCategory :execrows
DELETE FROM category_attributes
WHERE category_id = $1
  AND attribute_id = $2;

-- name: GetCategoryEffectiveAttributes :many
WITH RECURSIVE ancestor_chain AS (
    SELECT c.id, c.parent_id, 0 AS level
    FROM categories c
    WHERE c.id = $1 AND c.deleted_at IS NULL
    UNION ALL
    SELECT c.id, c.parent_id, ac.level + 1
    FROM categories c
    JOIN ancestor_chain ac ON c.id = ac.parent_id
    WHERE c.deleted_at IS NULL
),
ranked_links AS (
    SELECT
        ca.attribute_id,
        ca.sort_order,
        ca.is_required,
        ROW_NUMBER() OVER (
            PARTITION BY ca.attribute_id
            ORDER BY ac.level ASC
        ) AS rn
    FROM ancestor_chain ac
    JOIN category_attributes ca ON ca.category_id = ac.id
)
SELECT
    a.id,
    a.code,
    rl.sort_order,
    rl.is_required,
    COALESCE(t_req.label, t_def.label) AS label,
    COALESCE(t_req.slug,  t_def.slug)  AS slug
FROM ranked_links rl
JOIN attributes a ON a.id = rl.attribute_id AND a.deleted_at IS NULL
LEFT JOIN attribute_translations t_req
    ON a.id = t_req.attribute_id
    AND t_req.language_code = $2
    AND t_req.deleted_at IS NULL
LEFT JOIN attribute_translations t_def
    ON a.id = t_def.attribute_id
    AND t_def.language_code = 'en'
    AND t_def.deleted_at IS NULL
WHERE rl.rn = 1
ORDER BY rl.sort_order, COALESCE(t_req.label, t_def.label);
