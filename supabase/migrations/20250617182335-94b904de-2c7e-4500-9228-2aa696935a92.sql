
-- Insertar algunos restaurantes base de prueba
INSERT INTO public.base_restaurants (
  site_number,
  restaurant_name,
  address,
  city,
  state,
  postal_code,
  country,
  restaurant_type,
  square_meters,
  seating_capacity,
  franchisee_name,
  franchisee_email
) VALUES 
(
  '12345',
  'McDonald''s Gran Vía',
  'Gran Vía 45',
  'Madrid',
  'Madrid',
  '28013',
  'España',
  'traditional',
  200,
  80,
  'Franquicia Madrid Centro',
  'madrid@mcdonalds.es'
),
(
  '12346',
  'McDonald''s Plaza Mayor',
  'Plaza Mayor 8',
  'Madrid',
  'Madrid',
  '28012',
  'España',
  'traditional',
  150,
  60,
  'Franquicia Madrid Centro',
  'madrid@mcdonalds.es'
),
(
  '12347',
  'McDonald''s Atocha',
  'Calle Atocha 123',
  'Madrid',
  'Madrid',
  '28012',
  'España',
  'drive_thru',
  300,
  100,
  'Franquicia Madrid Centro',
  'madrid@mcdonalds.es'
);

-- Asignar estos restaurantes al franquiciado existente
-- Primero obtenemos el ID del franquiciado actual
WITH current_franchisee AS (
  SELECT f.id as franchisee_id
  FROM public.franchisees f
  JOIN public.profiles p ON p.id = f.user_id
  WHERE p.id = auth.uid()
  LIMIT 1
),
new_restaurants AS (
  SELECT id as restaurant_id
  FROM public.base_restaurants
  WHERE site_number IN ('12345', '12346', '12347')
)
INSERT INTO public.franchisee_restaurants (
  franchisee_id,
  base_restaurant_id,
  franchise_start_date,
  franchise_end_date,
  monthly_rent,
  last_year_revenue,
  status
)
SELECT 
  cf.franchisee_id,
  nr.restaurant_id,
  '2023-01-01'::date,
  '2033-12-31'::date,
  CASE 
    WHEN br.site_number = '12345' THEN 8500.00
    WHEN br.site_number = '12346' THEN 7200.00
    WHEN br.site_number = '12347' THEN 9800.00
  END,
  CASE 
    WHEN br.site_number = '12345' THEN 850000.00
    WHEN br.site_number = '12346' THEN 720000.00
    WHEN br.site_number = '12347' THEN 980000.00
  END,
  'active'
FROM current_franchisee cf
CROSS JOIN new_restaurants nr
JOIN public.base_restaurants br ON br.id = nr.restaurant_id
WHERE NOT EXISTS (
  SELECT 1 FROM public.franchisee_restaurants fr 
  WHERE fr.franchisee_id = cf.franchisee_id 
  AND fr.base_restaurant_id = nr.restaurant_id
);
