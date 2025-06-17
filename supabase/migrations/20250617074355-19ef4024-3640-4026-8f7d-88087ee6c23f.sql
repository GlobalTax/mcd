
-- Actualizar el rol del usuario actual de 'franchisee' a 'asesor'
UPDATE public.profiles 
SET role = 'asesor' 
WHERE email = 's.navarro@nrro.es';
