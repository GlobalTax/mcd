
-- Insertar las relaciones faltantes entre franquiciados y restaurantes
-- basándose en los datos de franchisee_name en base_restaurants
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
