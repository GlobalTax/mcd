
-- Limpiar todos los datos de prueba creados durante las pruebas

-- 1. Eliminar las asignaciones de restaurantes a franquiciados
DELETE FROM public.franchisee_restaurants 
WHERE franchisee_id IN (
  SELECT id FROM public.franchisees 
  WHERE franchisee_name = 'Samue'
);

-- 2. Eliminar los restaurantes base de prueba
DELETE FROM public.base_restaurants 
WHERE franchisee_name = 'Samue' 
OR site_number IN ('001', '002', '003');

-- 3. Eliminar el franquiciado de prueba
DELETE FROM public.franchisees 
WHERE franchisee_name = 'Samue';

-- 4. Verificar que se han eliminado correctamente
-- Contar restaurantes restantes
SELECT COUNT(*) as remaining_restaurants FROM public.base_restaurants;

-- Contar franquiciados restantes  
SELECT COUNT(*) as remaining_franchisees FROM public.franchisees;

-- Contar asignaciones restantes
SELECT COUNT(*) as remaining_assignments FROM public.franchisee_restaurants;
