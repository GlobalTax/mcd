
-- Verificar cuántos restaurantes base tienen información de franquiciados
SELECT 
  COUNT(*) as total_restaurants,
  COUNT(CASE WHEN franchisee_name IS NOT NULL AND franchisee_name != '' THEN 1 END) as restaurants_with_franchisee,
  COUNT(DISTINCT franchisee_name) as unique_franchisees
FROM public.base_restaurants;

-- Ver algunos ejemplos de nombres de franquiciados
SELECT DISTINCT 
  franchisee_name,
  franchisee_email,
  company_tax_id,
  COUNT(*) as restaurant_count
FROM public.base_restaurants 
WHERE franchisee_name IS NOT NULL AND franchisee_name != ''
GROUP BY franchisee_name, franchisee_email, company_tax_id
LIMIT 10;

-- Verificar qué franquiciados ya existen en la tabla
SELECT 
  franchisee_name,
  company_name,
  tax_id,
  total_restaurants
FROM public.franchisees
ORDER BY franchisee_name;
