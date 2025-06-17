
-- Actualizar el rol del usuario s.navarro@nrro.es a superadmin
UPDATE public.profiles 
SET role = 'superadmin' 
WHERE email = 's.navarro@nrro.es';
