
-- Ejecutar la función manual para vincular restaurantes a franquiciados existentes
SELECT public.manually_assign_restaurants_to_existing_franchisees();

-- Verificar que se crearon las vinculaciones
SELECT 
  f.franchisee_name,
  br.restaurant_name,
  br.site_number,
  fr.status,
  fr.assigned_at
FROM public.franchisee_restaurants fr
JOIN public.franchisees f ON f.id = fr.franchisee_id
JOIN public.base_restaurants br ON br.id = fr.base_restaurant_id
WHERE f.user_id = '9edfd88d-1820-4b65-b102-e015d0061ddd'
ORDER BY br.site_number;
