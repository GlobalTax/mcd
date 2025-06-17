
-- Crear el perfil para el nuevo usuario si no existe
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  gen_random_uuid(),
  's.navarro@obn.es',
  'S. Navarro',
  'franchisee'
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles WHERE email = 's.navarro@obn.es'
);

-- Crear el franquiciado para este usuario
INSERT INTO public.franchisees (
  user_id,
  franchisee_name,
  company_name,
  city,
  country
)
SELECT 
  p.id,
  'Franquicia OBN',
  'OBN Restaurantes S.L.',
  'Barcelona',
  'España'
FROM public.profiles p
WHERE p.email = 's.navarro@obn.es'
AND NOT EXISTS (
  SELECT 1 FROM public.franchisees f WHERE f.user_id = p.id
);

-- Crear algunos restaurantes base para este franquiciado
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
  '54321',
  'McDonald''s Passeig de Gràcia',
  'Passeig de Gràcia 89',
  'Barcelona',
  'Barcelona',
  '08008',
  'España',
  'traditional',
  180,
  70,
  'Franquicia OBN',
  's.navarro@obn.es'
),
(
  '54322',
  'McDonald''s Ramblas',
  'La Rambla 34',
  'Barcelona',
  'Barcelona',
  '08002',
  'España',
  'traditional',
  220,
  90,
  'Franquicia OBN',
  's.navarro@obn.es'
)
ON CONFLICT (site_number) DO NOTHING;

-- Asignar estos restaurantes al franquiciado OBN
WITH target_franchisee AS (
  SELECT f.id as franchisee_id
  FROM public.franchisees f
  JOIN public.profiles p ON p.id = f.user_id
  WHERE p.email = 's.navarro@obn.es'
  LIMIT 1
),
obn_restaurants AS (
  SELECT id as restaurant_id
  FROM public.base_restaurants
  WHERE site_number IN ('54321', '54322')
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
  tf.franchisee_id,
  obr.restaurant_id,
  '2022-06-01'::date,
  '2032-05-31'::date,
  CASE 
    WHEN br.site_number = '54321' THEN 12000.00
    WHEN br.site_number = '54322' THEN 10500.00
  END,
  CASE 
    WHEN br.site_number = '54321' THEN 950000.00
    WHEN br.site_number = '54322' THEN 880000.00
  END,
  'active'
FROM target_franchisee tf
CROSS JOIN obn_restaurants obr
JOIN public.base_restaurants br ON br.id = obr.restaurant_id
WHERE NOT EXISTS (
  SELECT 1 FROM public.franchisee_restaurants fr 
  WHERE fr.franchisee_id = tf.franchisee_id 
  AND fr.base_restaurant_id = obr.restaurant_id
);
