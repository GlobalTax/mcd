
-- Eliminar todos los franquiciados actuales
DELETE FROM franchisees;

-- Insertar franquiciados únicos desde base_restaurants
WITH advisor_user AS (
  SELECT id FROM profiles WHERE role IN ('advisor', 'admin', 'superadmin') LIMIT 1
),
unique_franchisees AS (
  SELECT 
    franchisee_name,
    franchisee_email,
    company_tax_id,
    COUNT(*) as restaurant_count,
    MIN(city) as city,
    MIN(state) as state,
    MIN(address) as address
  FROM base_restaurants 
  WHERE franchisee_name IS NOT NULL 
    AND franchisee_name != '' 
    AND TRIM(franchisee_name) != ''
  GROUP BY franchisee_name, franchisee_email, company_tax_id
)
INSERT INTO franchisees (
  user_id,
  franchisee_name,
  company_name,
  tax_id,
  city,
  state,
  address,
  total_restaurants
)
SELECT 
  au.id,
  uf.franchisee_name,
  uf.franchisee_name,
  uf.company_tax_id,
  uf.city,
  uf.state,
  uf.address,
  uf.restaurant_count
FROM advisor_user au
CROSS JOIN unique_franchisees uf;

-- Verificar cuántos franquiciados se han creado
SELECT COUNT(*) as total_franchisees_created FROM franchisees;

-- Mostrar algunos ejemplos de los franquiciados creados
SELECT 
  franchisee_name,
  city,
  total_restaurants
FROM franchisees 
ORDER BY total_restaurants DESC
LIMIT 10;
