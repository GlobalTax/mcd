
-- Actualizar el nombre del franquiciado para que coincida con los restaurantes
UPDATE public.franchisees 
SET franchisee_name = 'ROS I CHERTA'
WHERE user_id = '9edfd88d-1820-4b65-b102-e015d0061ddd';

-- Verificar que la actualización funcionó
SELECT id, franchisee_name, user_id FROM public.franchisees 
WHERE user_id = '9edfd88d-1820-4b65-b102-e015d0061ddd';
