
-- Primero, eliminar la restricción única en user_id para permitir múltiples franquiciados por usuario asesor
ALTER TABLE public.franchisees DROP CONSTRAINT IF EXISTS franchisees_user_id_key;

-- Luego, insertar solo los franquiciados que no existen aún
WITH existing_user AS (
  SELECT id FROM public.profiles WHERE role IN ('advisor', 'admin', 'superadmin') LIMIT 1
),
franchisee_data AS (
  SELECT DISTINCT
    br.franchisee_name,
    br.franchisee_email,
    br.company_tax_id as tax_id,
    (SELECT COUNT(*) FROM public.base_restaurants br2 WHERE br2.franchisee_name = br.franchisee_name) as total_restaurants
  FROM public.base_restaurants br
  WHERE br.franchisee_name IS NOT NULL
    AND br.franchisee_name != ''
    AND NOT EXISTS (
      SELECT 1 FROM public.franchisees f 
      WHERE f.franchisee_name = br.franchisee_name
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
  eu.id,
  fd.franchisee_name,
  fd.franchisee_name as company_name,
  fd.tax_id,
  fd.total_restaurants
FROM franchisee_data fd
CROSS JOIN existing_user eu;
