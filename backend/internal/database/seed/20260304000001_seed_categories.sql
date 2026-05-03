-- +goose Up
-- Seed categories tree (depth 0 -> 1 -> 2) with en/uk/pl translations.
-- Idempotent: safe to run multiple times.

INSERT INTO categories (id, parent_id, depth, sort_order) VALUES
-- roots
('11111111-1111-1111-1111-111111111111', NULL, 0, 10),
('22222222-2222-2222-2222-222222222222', NULL, 0, 20),
-- children of first root
('11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 1, 10),
('11111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 1, 20),
-- grandchildren
('11111111-1111-1111-1111-111111111114', '11111111-1111-1111-1111-111111111112', 2, 10),
('11111111-1111-1111-1111-111111111115', '11111111-1111-1111-1111-111111111112', 2, 20),
-- children of second root
('22222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 1, 10),
('22222222-2222-2222-2222-222222222224', '22222222-2222-2222-2222-222222222222', 1, 20),
-- Transport (root)
('33333333-3333-3333-3333-333333333333', NULL, 0, 30),
-- children of Transport
('33333333-3333-3333-3333-333333333334', '33333333-3333-3333-3333-333333333333', 1, 10),
('33333333-3333-3333-3333-333333333335', '33333333-3333-3333-3333-333333333333', 1, 20),
('33333333-3333-3333-3333-333333333336', '33333333-3333-3333-3333-333333333333', 1, 30),
('33333333-3333-3333-3333-333333333339', '33333333-3333-3333-3333-333333333333', 1, 40),
('33333333-3333-3333-3333-33333333333a', '33333333-3333-3333-3333-333333333333', 1, 50),
('33333333-3333-3333-3333-33333333333b', '33333333-3333-3333-3333-333333333333', 1, 60),
-- grandchildren (under Cars)
('33333333-3333-3333-3333-333333333337', '33333333-3333-3333-3333-333333333334', 2, 10),
('33333333-3333-3333-3333-333333333338', '33333333-3333-3333-3333-333333333334', 2, 20),
-- Construction (root)
('44444444-4444-4444-4444-444444444444', NULL, 0, 40),
-- children of Construction
('44444444-4444-4444-4444-444444444445', '44444444-4444-4444-4444-444444444444', 1, 10),
('44444444-4444-4444-4444-444444444446', '44444444-4444-4444-4444-444444444444', 1, 20),
('44444444-4444-4444-4444-444444444447', '44444444-4444-4444-4444-444444444444', 1, 30),
-- grandchildren (under Tools)
('44444444-4444-4444-4444-444444444448', '44444444-4444-4444-4444-444444444445', 2, 10),
('44444444-4444-4444-4444-444444444449', '44444444-4444-4444-4444-444444444445', 2, 20),
-- grandchildren (under Materials)
('44444444-4444-4444-4444-44444444444a', '44444444-4444-4444-4444-444444444446', 2, 10),
('44444444-4444-4444-4444-44444444444b', '44444444-4444-4444-4444-444444444446', 2, 20),
-- grandchildren (under Equipment)
('44444444-4444-4444-4444-44444444444c', '44444444-4444-4444-4444-444444444447', 2, 10),
('44444444-4444-4444-4444-44444444444d', '44444444-4444-4444-4444-444444444447', 2, 20)
ON CONFLICT (id) DO UPDATE SET
  parent_id = EXCLUDED.parent_id,
  depth = EXCLUDED.depth,
  sort_order = EXCLUDED.sort_order,
  updated_at = NOW();

INSERT INTO category_translations (id, category_id, language_code, title, slug, full_slug) VALUES
-- Electronics (root)
('aaaaaaa1-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'en', 'Electronics', 'electronics', '/electronics'),
('aaaaaaa1-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'uk', 'Електроніка', 'elektronika', '/elektronika'),
('aaaaaaa1-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'pl', 'Elektronika', 'elektronika', '/elektronika'),
-- Phones
('aaaaaaa2-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111112', 'en', 'Phones', 'phones', '/electronics/phones'),
('aaaaaaa2-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111112', 'uk', 'Телефони', 'telefony', '/elektronika/telefony'),
('aaaaaaa2-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111112', 'pl', 'Telefony', 'telefony', '/elektronika/telefony'),
-- Laptops
('aaaaaaa3-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111113', 'en', 'Laptops', 'laptops', '/electronics/laptops'),
('aaaaaaa3-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111113', 'uk', 'Ноутбуки', 'noutbuky', '/elektronika/noutbuky'),
('aaaaaaa3-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111113', 'pl', 'Laptopy', 'laptopy', '/elektronika/laptopy'),
-- Smartphones
('aaaaaaa4-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111114', 'en', 'Smartphones', 'smartphones', '/electronics/phones/smartphones'),
('aaaaaaa4-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111114', 'uk', 'Смартфони', 'smartfony', '/elektronika/telefony/smartfony'),
('aaaaaaa4-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111114', 'pl', 'Smartfony', 'smartfony', '/elektronika/telefony/smartfony'),
-- Accessories
('aaaaaaa5-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111115', 'en', 'Accessories', 'accessories', '/electronics/phones/accessories'),
('aaaaaaa5-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111115', 'uk', 'Аксесуари', 'aksesuary', '/elektronika/telefony/aksesuary'),
('aaaaaaa5-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111115', 'pl', 'Akcesoria', 'akcesoria', '/elektronika/telefony/akcesoria'),
-- Home (root)
('aaaaaaa6-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'en', 'Home', 'home', '/home'),
('aaaaaaa6-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'uk', 'Дім', 'dim', '/dim'),
('aaaaaaa6-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'pl', 'Dom', 'dom', '/dom'),
-- Kitchen
('aaaaaaa7-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222223', 'en', 'Kitchen', 'kitchen', '/home/kitchen'),
('aaaaaaa7-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222223', 'uk', 'Кухня', 'kukhnia', '/dim/kukhnia'),
('aaaaaaa7-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222223', 'pl', 'Kuchnia', 'kuchnia', '/dom/kuchnia'),
-- Furniture
('aaaaaaa8-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222224', 'en', 'Furniture', 'furniture', '/home/furniture'),
('aaaaaaa8-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222224', 'uk', 'Меблі', 'mebli', '/dim/mebli'),
('aaaaaaa8-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222224', 'pl', 'Meble', 'meble', '/dom/meble'),
-- Transport (root)
('aaaaaaa9-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'en', 'Transport', 'transport', '/transport'),
('aaaaaaa9-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'uk', 'Транспорт', 'transport', '/transport'),
('aaaaaaa9-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'pl', 'Transport', 'transport', '/transport'),
-- Cars
('aaaaaaa9-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333334', 'en', 'Cars', 'cars', '/transport/cars'),
('aaaaaaa9-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333334', 'uk', 'Автомобілі', 'avtomobili', '/transport/avtomobili'),
('aaaaaaa9-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333334', 'pl', 'Samochody', 'samochody', '/transport/samochody'),
-- Motorcycles
('aaaaaaa9-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333335', 'en', 'Motorcycles', 'motorcycles', '/transport/motorcycles'),
('aaaaaaa9-0000-0000-0000-000000000008', '33333333-3333-3333-3333-333333333335', 'uk', 'Мотоцикли', 'mototsykly', '/transport/mototsykly'),
('aaaaaaa9-0000-0000-0000-000000000009', '33333333-3333-3333-3333-333333333335', 'pl', 'Motocykle', 'motocykle', '/transport/motocykle'),
-- Bikes
('aaaaaaa9-0000-0000-0000-00000000000a', '33333333-3333-3333-3333-333333333336', 'en', 'Bikes', 'bikes', '/transport/bikes'),
('aaaaaaa9-0000-0000-0000-00000000000b', '33333333-3333-3333-3333-333333333336', 'uk', 'Велосипеди', 'velosypedy', '/transport/velosypedy'),
('aaaaaaa9-0000-0000-0000-00000000000c', '33333333-3333-3333-3333-333333333336', 'pl', 'Rowery', 'rowery', '/transport/rowery'),
-- Sedans
('aaaaaaa9-0000-0000-0000-00000000000d', '33333333-3333-3333-3333-333333333337', 'en', 'Sedans', 'sedans', '/transport/cars/sedans'),
('aaaaaaa9-0000-0000-0000-00000000000e', '33333333-3333-3333-3333-333333333337', 'uk', 'Седани', 'sedany', '/transport/avtomobili/sedany'),
('aaaaaaa9-0000-0000-0000-00000000000f', '33333333-3333-3333-3333-333333333337', 'pl', 'Sedany', 'sedany', '/transport/samochody/sedany'),
-- SUVs
('aaaaaaa9-0000-0000-0000-000000000010', '33333333-3333-3333-3333-333333333338', 'en', 'SUVs', 'suvs', '/transport/cars/suvs'),
('aaaaaaa9-0000-0000-0000-000000000011', '33333333-3333-3333-3333-333333333338', 'uk', 'Позашляховики', 'pozashtovkhovykhy', '/transport/avtomobili/pozashtovkhovykhy'),
('aaaaaaa9-0000-0000-0000-000000000012', '33333333-3333-3333-3333-333333333338', 'pl', 'SUV-y', 'suv-y', '/transport/samochody/suv-y'),
-- Trucks/Vans
('aaaaaaa9-0000-0000-0000-000000000013', '33333333-3333-3333-3333-333333333339', 'en', 'Trucks & Vans',     'trucks-vans',        '/transport/trucks-vans'),
('aaaaaaa9-0000-0000-0000-000000000014', '33333333-3333-3333-3333-333333333339', 'uk', 'Вантажівки і фургони', 'vantazhivky-furhony', '/transport/vantazhivky-furhony'),
('aaaaaaa9-0000-0000-0000-000000000015', '33333333-3333-3333-3333-333333333339', 'pl', 'Ciężarówki i busy', 'ciezarowki-busy',    '/transport/ciezarowki-busy'),
-- Boats/Watercraft
('aaaaaaa9-0000-0000-0000-000000000016', '33333333-3333-3333-3333-33333333333a', 'en', 'Boats & Watercraft', 'boats-watercraft', '/transport/boats-watercraft'),
('aaaaaaa9-0000-0000-0000-000000000017', '33333333-3333-3333-3333-33333333333a', 'uk', 'Човни і водна техніка', 'chovny-vodna-tekhnika', '/transport/chovny-vodna-tekhnika'),
('aaaaaaa9-0000-0000-0000-000000000018', '33333333-3333-3333-3333-33333333333a', 'pl', 'Łodzie i jednostki pływające', 'lodzie-jednostki-plywajace', '/transport/lodzie-jednostki-plywajace'),
-- Trailers
('aaaaaaa9-0000-0000-0000-000000000019', '33333333-3333-3333-3333-33333333333b', 'en', 'Trailers',  'trailers', '/transport/trailers'),
('aaaaaaa9-0000-0000-0000-00000000001a', '33333333-3333-3333-3333-33333333333b', 'uk', 'Причепи',   'prychepy', '/transport/prychepy'),
('aaaaaaa9-0000-0000-0000-00000000001b', '33333333-3333-3333-3333-33333333333b', 'pl', 'Przyczepy', 'przyczepy', '/transport/przyczepy'),
-- Construction (root)
('aaaaaaab-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'en', 'Construction', 'construction',   '/construction'),
('aaaaaaab-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'uk', 'Будівництво',  'budivnytstvo',   '/budivnytstvo'),
('aaaaaaab-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'pl', 'Budownictwo',  'budownictwo',    '/budownictwo'),
-- Tools
('aaaaaaab-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444445', 'en', 'Tools',         'tools',        '/construction/tools'),
('aaaaaaab-0000-0000-0000-000000000005', '44444444-4444-4444-4444-444444444445', 'uk', 'Інструменти',   'instrumenty',  '/budivnytstvo/instrumenty'),
('aaaaaaab-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444445', 'pl', 'Narzędzia',     'narzedzia',    '/budownictwo/narzedzia'),
-- Materials
('aaaaaaab-0000-0000-0000-000000000007', '44444444-4444-4444-4444-444444444446', 'en', 'Materials',     'materials',    '/construction/materials'),
('aaaaaaab-0000-0000-0000-000000000008', '44444444-4444-4444-4444-444444444446', 'uk', 'Матеріали',     'materialy',    '/budivnytstvo/materialy'),
('aaaaaaab-0000-0000-0000-000000000009', '44444444-4444-4444-4444-444444444446', 'pl', 'Materiały',     'materialy',    '/budownictwo/materialy'),
-- Equipment
('aaaaaaab-0000-0000-0000-00000000000a', '44444444-4444-4444-4444-444444444447', 'en', 'Equipment',     'equipment',    '/construction/equipment'),
('aaaaaaab-0000-0000-0000-00000000000b', '44444444-4444-4444-4444-444444444447', 'uk', 'Обладнання',    'obladnannia',  '/budivnytstvo/obladnannia'),
('aaaaaaab-0000-0000-0000-00000000000c', '44444444-4444-4444-4444-444444444447', 'pl', 'Sprzęt',        'sprzet',       '/budownictwo/sprzet'),
-- Power Tools
('aaaaaaab-0000-0000-0000-00000000000d', '44444444-4444-4444-4444-444444444448', 'en', 'Power Tools',         'power-tools',         '/construction/tools/power-tools'),
('aaaaaaab-0000-0000-0000-00000000000e', '44444444-4444-4444-4444-444444444448', 'uk', 'Електроінструменти',  'elektroinstrumenty',  '/budivnytstvo/instrumenty/elektroinstrumenty'),
('aaaaaaab-0000-0000-0000-00000000000f', '44444444-4444-4444-4444-444444444448', 'pl', 'Elektronarzędzia',    'elektronarzedzia',    '/budownictwo/narzedzia/elektronarzedzia'),
-- Hand Tools
('aaaaaaab-0000-0000-0000-000000000010', '44444444-4444-4444-4444-444444444449', 'en', 'Hand Tools',          'hand-tools',          '/construction/tools/hand-tools'),
('aaaaaaab-0000-0000-0000-000000000011', '44444444-4444-4444-4444-444444444449', 'uk', 'Ручні інструменти',   'ruchni-instrumenty',  '/budivnytstvo/instrumenty/ruchni-instrumenty'),
('aaaaaaab-0000-0000-0000-000000000012', '44444444-4444-4444-4444-444444444449', 'pl', 'Narzędzia ręczne',    'narzedzia-reczne',    '/budownictwo/narzedzia/narzedzia-reczne'),
-- Lumber & Wood
('aaaaaaab-0000-0000-0000-000000000013', '44444444-4444-4444-4444-44444444444a', 'en', 'Lumber & Wood',  'lumber-wood',  '/construction/materials/lumber-wood'),
('aaaaaaab-0000-0000-0000-000000000014', '44444444-4444-4444-4444-44444444444a', 'uk', 'Деревина',       'derevyna',     '/budivnytstvo/materialy/derevyna'),
('aaaaaaab-0000-0000-0000-000000000015', '44444444-4444-4444-4444-44444444444a', 'pl', 'Drewno',         'drewno',       '/budownictwo/materialy/drewno'),
-- Concrete & Masonry
('aaaaaaab-0000-0000-0000-000000000016', '44444444-4444-4444-4444-44444444444b', 'en', 'Concrete & Masonry', 'concrete-masonry',  '/construction/materials/concrete-masonry'),
('aaaaaaab-0000-0000-0000-000000000017', '44444444-4444-4444-4444-44444444444b', 'uk', 'Бетон і кладка',     'beton-i-kladka',    '/budivnytstvo/materialy/beton-i-kladka'),
('aaaaaaab-0000-0000-0000-000000000018', '44444444-4444-4444-4444-44444444444b', 'pl', 'Beton i murarstwo',  'beton-i-murarstwo', '/budownictwo/materialy/beton-i-murarstwo'),
-- Generators
('aaaaaaab-0000-0000-0000-000000000019', '44444444-4444-4444-4444-44444444444c', 'en', 'Generators',  'generators', '/construction/equipment/generators'),
('aaaaaaab-0000-0000-0000-00000000001a', '44444444-4444-4444-4444-44444444444c', 'uk', 'Генератори',  'heneratory', '/budivnytstvo/obladnannia/heneratory'),
('aaaaaaab-0000-0000-0000-00000000001b', '44444444-4444-4444-4444-44444444444c', 'pl', 'Generatory',  'generatory', '/budownictwo/sprzet/generatory'),
-- Excavators
('aaaaaaab-0000-0000-0000-00000000001c', '44444444-4444-4444-4444-44444444444d', 'en', 'Excavators',   'excavators',   '/construction/equipment/excavators'),
('aaaaaaab-0000-0000-0000-00000000001d', '44444444-4444-4444-4444-44444444444d', 'uk', 'Екскаватори',  'ekskavatory',  '/budivnytstvo/obladnannia/ekskavatory'),
('aaaaaaab-0000-0000-0000-00000000001e', '44444444-4444-4444-4444-44444444444d', 'pl', 'Koparki',      'koparki',      '/budownictwo/sprzet/koparki')
ON CONFLICT (category_id, language_code) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  full_slug = EXCLUDED.full_slug,
  updated_at = NOW();

-- +goose Down
DELETE FROM categories
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111112',
  '11111111-1111-1111-1111-111111111113',
  '11111111-1111-1111-1111-111111111114',
  '11111111-1111-1111-1111-111111111115',
  '22222222-2222-2222-2222-222222222223',
  '22222222-2222-2222-2222-222222222224',
  '33333333-3333-3333-3333-333333333333',
  '33333333-3333-3333-3333-333333333334',
  '33333333-3333-3333-3333-333333333335',
  '33333333-3333-3333-3333-333333333336',
  '33333333-3333-3333-3333-333333333337',
  '33333333-3333-3333-3333-333333333338',
  '33333333-3333-3333-3333-333333333339',
  '33333333-3333-3333-3333-33333333333a',
  '33333333-3333-3333-3333-33333333333b',
  '44444444-4444-4444-4444-444444444444',
  '44444444-4444-4444-4444-444444444445',
  '44444444-4444-4444-4444-444444444446',
  '44444444-4444-4444-4444-444444444447',
  '44444444-4444-4444-4444-444444444448',
  '44444444-4444-4444-4444-444444444449',
  '44444444-4444-4444-4444-44444444444a',
  '44444444-4444-4444-4444-44444444444b',
  '44444444-4444-4444-4444-44444444444c',
  '44444444-4444-4444-4444-44444444444d'
);
