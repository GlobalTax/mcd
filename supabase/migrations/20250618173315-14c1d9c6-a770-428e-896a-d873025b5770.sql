
-- Insertar restaurantes base para el franquiciado "ROS I CHERTA"
INSERT INTO public.base_restaurants (
  site_number,
  restaurant_name,
  address,
  city,
  state,
  country,
  restaurant_type,
  franchisee_name,
  franchisee_email,
  square_meters,
  seating_capacity
) VALUES 
(
  'ROS001',
  'McDonald''s Ros i Cherta Plaza',
  'Plaza Mayor, 15',
  'Barcelona',
  'Barcelona',
  'España',
  'traditional',
  'ROS I CHERTA',
  'rosicherta@example.com',
  200,
  80
),
(
  'ROS002', 
  'McDonald''s Ros i Cherta Centro',
  'Carrer de Pelai, 42',
  'Barcelona',
  'Barcelona',
  'España',
  'traditional',
  'ROS I CHERTA',
  'rosicherta@example.com',
  180,
  70
),
(
  'ROS003',
  'McDonald''s Ros i Cherta Norte',
  'Avinguda Meridiana, 156',
  'Barcelona',
  'Barcelona', 
  'España',
  'traditional',
  'ROS I CHERTA',
  'rosicherta@example.com',
  220,
  90
);

-- Asignar automáticamente los restaurantes al franquiciado usando la función existente
-- Esto vinculará todos los restaurantes que tengan franchisee_name = 'ROS I CHERTA'
-- con el franquiciado correspondiente
INSERT INTO public.franchisee_restaurants (
  franchisee_id,
  base_restaurant_id,
  status,
  franchise_start_date,
  franchise_end_date,
  monthly_rent,
  last_year_revenue,
  assigned_at
)
SELECT 
  f.id as franchisee_id,
  br.id as base_restaurant_id,
  'active' as status,
  '2020-01-01'::date as franchise_start_date,
  '2030-12-31'::date as franchise_end_date,
  8000 as monthly_rent,
  2500000 as last_year_revenue,
  now() as assigned_at
FROM public.franchisees f
JOIN public.base_restaurants br ON br.franchisee_name = f.franchisee_name
WHERE f.franchisee_name = 'ROS I CHERTA'
AND NOT EXISTS (
  -- Evitar duplicados
  SELECT 1 FROM public.franchisee_restaurants fr
  WHERE fr.franchisee_id = f.id AND fr.base_restaurant_id = br.id
);
