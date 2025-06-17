
-- Insertar franquiciados únicos desde base_restaurants a la tabla franchisees
WITH advisor_user AS (
  SELECT id FROM public.profiles WHERE role IN ('advisor', 'admin', 'superadmin') LIMIT 1
),
unique_franchisees AS (
  SELECT DISTINCT 
    franchisee_name,
    franchisee_email,
    company_tax_id,
    COUNT(*) OVER (PARTITION BY franchisee_name) as restaurant_count
  FROM public.base_restaurants 
  WHERE franchisee_name IS NOT NULL 
    AND franchisee_name != '' 
    AND franchisee_name NOT IN (
      SELECT franchisee_name FROM public.franchisees
    )
)
INSERT INTO public.franchisees (
  user_id,
  franchisee_name,
  company_name,
  tax_id,
  total_restaurants
)
SELECT 
  au.id,
  uf.franchisee_name,
  uf.franchisee_name, -- Usar el nombre del franquiciado como nombre de empresa si no hay otro
  uf.company_tax_id,
  uf.restaurant_count
FROM advisor_user au
CROSS JOIN unique_franchisees uf
WHERE uf.franchisee_name IS NOT NULL;
