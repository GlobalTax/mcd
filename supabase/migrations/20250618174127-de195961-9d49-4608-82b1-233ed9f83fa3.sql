
-- Asegurarnos de que existen las vinculaciones entre el franquiciado y sus restaurantes
INSERT INTO public.franchisee_restaurants (
  franchisee_id,
  base_restaurant_id,
  franchise_start_date,
  franchise_end_date,
  monthly_rent,
  last_year_revenue,
  status,
  assigned_at
)
SELECT 
  f.id as franchisee_id,
  br.id as base_restaurant_id,
  CASE 
    WHEN br.site_number = '631' THEN '2018-03-15'::date
    WHEN br.site_number = '707' THEN '2019-06-20'::date
    WHEN br.site_number = '855' THEN '2017-11-10'::date
  END as franchise_start_date,
  '2033-12-31'::date as franchise_end_date,
  CASE 
    WHEN br.site_number = '631' THEN 7500
    WHEN br.site_number = '707' THEN 9200
    WHEN br.site_number = '855' THEN 6800
  END as monthly_rent,
  CASE 
    WHEN br.site_number = '631' THEN 2200000
    WHEN br.site_number = '707' THEN 2800000
    WHEN br.site_number = '855' THEN 1950000
  END as last_year_revenue,
  'active' as status,
  now() as assigned_at
FROM public.franchisees f
CROSS JOIN public.base_restaurants br
WHERE f.user_id = '9edfd88d-1820-4b65-b102-e015d0061ddd'
AND br.site_number IN ('631', '707', '855')
AND NOT EXISTS (
  -- Evitar duplicados si ya existe la vinculación
  SELECT 1 FROM public.franchisee_restaurants fr
  WHERE fr.franchisee_id = f.id AND fr.base_restaurant_id = br.id
);

-- Verificar que se crearon las vinculaciones
SELECT 
  f.franchisee_name,
  br.restaurant_name,
  br.site_number,
  fr.monthly_rent,
  fr.last_year_revenue,
  fr.franchise_start_date,
  fr.franchise_end_date,
  fr.status
FROM public.franchisee_restaurants fr
JOIN public.franchisees f ON f.id = fr.franchisee_id
JOIN public.base_restaurants br ON br.id = fr.base_restaurant_id
WHERE f.user_id = '9edfd88d-1820-4b65-b102-e015d0061ddd'
ORDER BY br.site_number;
