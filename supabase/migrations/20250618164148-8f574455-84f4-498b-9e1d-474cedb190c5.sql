
-- Primero, insertamos todos los franquiciados únicos desde base_restaurants
INSERT INTO public.franchisees (franchisee_name, company_name, created_at, updated_at)
SELECT DISTINCT 
  br.franchisee_name,
  br.franchisee_name as company_name,
  now() as created_at,
  now() as updated_at
FROM public.base_restaurants br
WHERE br.franchisee_name IS NOT NULL 
  AND br.franchisee_name != ''
  AND NOT EXISTS (
    SELECT 1 FROM public.franchisees f 
    WHERE f.franchisee_name = br.franchisee_name
  );

-- Luego, vinculamos todos los restaurantes con sus franquiciados
INSERT INTO public.franchisee_restaurants (
  franchisee_id,
  base_restaurant_id,
  status,
  assigned_at
)
SELECT DISTINCT 
  f.id as franchisee_id,
  br.id as base_restaurant_id,
  'active' as status,
  now() as assigned_at
FROM public.franchisees f
JOIN public.base_restaurants br ON br.franchisee_name = f.franchisee_name
WHERE NOT EXISTS (
  SELECT 1 FROM public.franchisee_restaurants fr 
  WHERE fr.franchisee_id = f.id AND fr.base_restaurant_id = br.id
)
AND br.franchisee_name IS NOT NULL 
AND br.franchisee_name != '';

-- Actualizar información adicional de franquiciados desde base_restaurants
UPDATE public.franchisees 
SET 
  tax_id = COALESCE(franchisees.tax_id, br_data.company_tax_id),
  city = COALESCE(franchisees.city, br_data.city),
  state = COALESCE(franchisees.state, br_data.state),
  updated_at = now()
FROM (
  SELECT DISTINCT ON (franchisee_name)
    franchisee_name,
    company_tax_id,
    city,
    state
  FROM public.base_restaurants 
  WHERE franchisee_name IS NOT NULL 
    AND franchisee_name != ''
  ORDER BY franchisee_name, created_at DESC
) as br_data
WHERE franchisees.franchisee_name = br_data.franchisee_name;

-- Contar restaurantes por franquiciado y actualizar el total
UPDATE public.franchisees 
SET total_restaurants = restaurant_counts.count
FROM (
  SELECT 
    f.id as franchisee_id,
    COUNT(fr.id) as count
  FROM public.franchisees f
  LEFT JOIN public.franchisee_restaurants fr ON fr.franchisee_id = f.id
  GROUP BY f.id
) as restaurant_counts
WHERE franchisees.id = restaurant_counts.franchisee_id;
