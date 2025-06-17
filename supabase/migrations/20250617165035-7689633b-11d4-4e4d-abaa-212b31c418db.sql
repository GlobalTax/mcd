
-- Verificar el total de registros en la tabla franchisees
SELECT COUNT(*) as total_franchisees FROM franchisees;

-- Verificar algunos registros de ejemplo para ver si los datos están ahí
SELECT 
  id,
  franchisee_name,
  company_name,
  city,
  created_at
FROM franchisees 
ORDER BY created_at DESC 
LIMIT 10;

-- Verificar si hay problemas con las relaciones a profiles
SELECT 
  f.id,
  f.franchisee_name,
  f.user_id,
  p.email,
  p.full_name
FROM franchisees f
LEFT JOIN profiles p ON f.user_id = p.id
LIMIT 10;

-- Verificar registros por fecha de creación para ver si hubo alguna pérdida de datos
SELECT 
  DATE(created_at) as creation_date,
  COUNT(*) as franchisees_created
FROM franchisees 
GROUP BY DATE(created_at)
ORDER BY creation_date DESC
LIMIT 20;
