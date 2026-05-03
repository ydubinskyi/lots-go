-- +goose Up

CREATE TABLE attributes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    CONSTRAINT uq_attributes_code UNIQUE (code)
);

CREATE TABLE attribute_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attribute_id UUID NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
    language_code language_code NOT NULL,
    label VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    CONSTRAINT uq_attribute_translations_attribute_lang UNIQUE (attribute_id, language_code)
);

CREATE TABLE category_attributes (
    category_id  UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
    sort_order   INTEGER NOT NULL DEFAULT 0,
    is_required  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (category_id, attribute_id)
);

CREATE INDEX idx_attribute_translations_attribute_id ON attribute_translations(attribute_id);
CREATE INDEX idx_category_attributes_attribute_id    ON category_attributes(attribute_id);

-- +goose Down
DROP TABLE IF EXISTS category_attributes;
DROP TABLE IF EXISTS attribute_translations;
DROP TABLE IF EXISTS attributes;
