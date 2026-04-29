-- +goose Up
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE language_code AS ENUM (
    'en',    -- English (default)
    'pl',    -- Polish
    'uk'     -- Ukrainian
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    depth INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT chk_categories_not_self_parent CHECK (id != parent_id),
    CONSTRAINT chk_categories_depth_non_negative CHECK (depth >= 0),
    CONSTRAINT chk_categories_depth_max CHECK (depth <= 2)
);

CREATE TABLE category_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    language_code language_code NOT NULL,  -- ENUM type
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    full_slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT uq_category_translations_category_lang UNIQUE(category_id, language_code)
);


-- +goose Down
DROP TABLE IF EXISTS category_translations;
DROP TABLE IF EXISTS categories;
DROP TYPE IF EXISTS language_code;