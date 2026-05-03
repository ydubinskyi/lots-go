-- +goose Up
-- Seed attributes (VIN, Mileage) and attach them to the Cars category.
-- Idempotent: safe to run multiple times.

INSERT INTO attributes (id, code) VALUES
('bbbbbbb1-0000-0000-0000-000000000001', 'vin'),
('bbbbbbb2-0000-0000-0000-000000000001', 'mileage_km')
ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  updated_at = NOW();

INSERT INTO attribute_translations (id, attribute_id, language_code, label, slug) VALUES
-- VIN
('bbbbbbb1-0000-0000-0000-000000000002', 'bbbbbbb1-0000-0000-0000-000000000001', 'en', 'VIN number',  'vin'),
('bbbbbbb1-0000-0000-0000-000000000003', 'bbbbbbb1-0000-0000-0000-000000000001', 'pl', 'Numer VIN',   'vin'),
('bbbbbbb1-0000-0000-0000-000000000004', 'bbbbbbb1-0000-0000-0000-000000000001', 'uk', 'VIN-код',     'vin-kod'),
-- Mileage
('bbbbbbb2-0000-0000-0000-000000000002', 'bbbbbbb2-0000-0000-0000-000000000001', 'en', 'Mileage (km)',  'mileage-km'),
('bbbbbbb2-0000-0000-0000-000000000003', 'bbbbbbb2-0000-0000-0000-000000000001', 'pl', 'Przebieg (km)', 'przebieg-km'),
('bbbbbbb2-0000-0000-0000-000000000004', 'bbbbbbb2-0000-0000-0000-000000000001', 'uk', 'Пробіг (км)',   'probih-km')
ON CONFLICT (attribute_id, language_code) DO UPDATE SET
  label = EXCLUDED.label,
  slug = EXCLUDED.slug,
  updated_at = NOW();

-- Attach VIN and Mileage to the Cars category (33333333-3333-3333-3333-333333333334).
-- Sedans/SUVs inherit them via the recursive effective-attributes query.
INSERT INTO category_attributes (category_id, attribute_id, sort_order, is_required) VALUES
('33333333-3333-3333-3333-333333333334', 'bbbbbbb1-0000-0000-0000-000000000001', 10, TRUE),
('33333333-3333-3333-3333-333333333334', 'bbbbbbb2-0000-0000-0000-000000000001', 20, TRUE)
ON CONFLICT (category_id, attribute_id) DO UPDATE SET
  sort_order = EXCLUDED.sort_order,
  is_required = EXCLUDED.is_required,
  updated_at = NOW();

-- +goose Down
DELETE FROM attributes
WHERE id IN (
  'bbbbbbb1-0000-0000-0000-000000000001',
  'bbbbbbb2-0000-0000-0000-000000000001'
);
