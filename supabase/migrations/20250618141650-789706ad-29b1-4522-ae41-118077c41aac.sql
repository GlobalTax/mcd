
-- Primero, modificar la tabla franchisees para permitir user_id como NULL
ALTER TABLE public.franchisees 
ALTER COLUMN user_id DROP NOT NULL;

-- Ahora limpiar la asignación incorrecta de user_id en franquiciados
-- Solo mantener la asignación para el franquiciado que realmente corresponde a s.navarro@nrro.es
UPDATE public.franchisees 
SET user_id = NULL 
WHERE user_id = (
  SELECT id FROM public.profiles WHERE email = 's.navarro@nrro.es'
) 
AND franchisee_name != 'ABRIL SANCHEZ, PATRICIA';

-- Verificar el resultado
SELECT 
  franchisee_name,
  user_id,
  (SELECT email FROM public.profiles WHERE id = franchisees.user_id) as user_email
FROM public.franchisees 
WHERE user_id IS NOT NULL;
