
-- 1. Eliminar las vinculaciones de los restaurantes de ejemplo
DELETE FROM public.franchisee_restaurants 
WHERE base_restaurant_id IN (
  SELECT id FROM public.base_restaurants 
  WHERE franchisee_name = 'ROS I CHERTA'
);

-- 2. Eliminar los restaurantes de ejemplo
DELETE FROM public.base_restaurants 
WHERE franchisee_name = 'ROS I CHERTA';

-- 3. Actualizar los restaurantes reales con datos más completos
UPDATE public.base_restaurants 
SET 
  franchisee_name = 'ROS I CHERTA',
  franchisee_email = 'rosicherta@example.com',
  square_meters = CASE 
    WHEN site_number = '631' THEN 180
    WHEN site_number = '707' THEN 250
    WHEN site_number = '855' THEN 160
  END,
  seating_capacity = CASE 
    WHEN site_number = '631' THEN 70
    WHEN site_number = '707' THEN 100
    WHEN site_number = '855' THEN 60
  END,
  property_type = CASE 
    WHEN site_number = '631' THEN 'Instore'
    WHEN site_number = '707' THEN 'Free-Standing'
    WHEN site_number = '855' THEN 'Instore'
  END,
  opening_date = CASE 
    WHEN site_number = '631' THEN '2018-03-15'::date
    WHEN site_number = '707' THEN '2019-06-20'::date
    WHEN site_number = '855' THEN '2017-11-10'::date
  END
WHERE site_number IN ('631', '707', '855');

-- 4. Actualizar las vinculaciones existentes con datos de franquicia
UPDATE public.franchisee_restaurants 
SET 
  franchise_start_date = CASE 
    WHEN br.site_number = '631' THEN '2018-03-15'::date
    WHEN br.site_number = '707' THEN '2019-06-20'::date
    WHEN br.site_number = '855' THEN '2017-11-10'::date
  END,
  franchise_end_date = '2033-12-31'::date,
  monthly_rent = CASE 
    WHEN br.site_number = '631' THEN 7500
    WHEN br.site_number = '707' THEN 9200
    WHEN br.site_number = '855' THEN 6800
  END,
  last_year_revenue = CASE 
    WHEN br.site_number = '631' THEN 2200000
    WHEN br.site_number = '707' THEN 2800000
    WHEN br.site_number = '855' THEN 1950000
  END,
  status = 'active'
FROM public.base_restaurants br
WHERE franchisee_restaurants.base_restaurant_id = br.id
AND br.site_number IN ('631', '707', '855');

-- 5. Verificar los resultados
SELECT 
  br.site_number,
  br.restaurant_name,
  br.city,
  br.square_meters,
  br.seating_capacity,
  fr.monthly_rent,
  fr.last_year_revenue,
  fr.franchise_start_date,
  fr.franchise_end_date
FROM public.base_restaurants br
JOIN public.franchisee_restaurants fr ON br.id = fr.base_restaurant_id
JOIN public.franchisees f ON f.id = fr.franchisee_id
WHERE f.user_id = '9edfd88d-1820-4b65-b102-e015d0061ddd'
ORDER BY br.site_number;
