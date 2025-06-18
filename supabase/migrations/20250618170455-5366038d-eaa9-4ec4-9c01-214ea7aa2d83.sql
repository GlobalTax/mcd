
-- Insertar restaurantes base de ejemplo
INSERT INTO public.base_restaurants (
  site_number, 
  restaurant_name, 
  address, 
  city, 
  franchisee_name, 
  franchisee_email,
  company_tax_id
) VALUES 
  ('001', 'McDonald''s Plaza Mayor', 'Calle Gran Vía 1', 'Madrid', 'Samue', 'samuel.lorente@gmail.com', '12345678A'),
  ('002', 'McDonald''s Centro', 'Calle Alcalá 50', 'Madrid', 'Samue', 'samuel.lorente@gmail.com', '12345678A'),
  ('003', 'McDonald''s Norte', 'Paseo de la Castellana 100', 'Madrid', 'Samue', 'samuel.lorente@gmail.com', '12345678A');
