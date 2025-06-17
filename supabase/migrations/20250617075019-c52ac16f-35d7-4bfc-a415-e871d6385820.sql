
-- Actualizar el constraint para incluir los nuevos roles de jerarquía
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Agregar un nuevo constraint que incluya todos los roles incluyendo 'superadmin' y 'admin'
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'franchisee', 'manager', 'asesor', 'asistente', 'superadmin'));

-- Actualizar tu usuario a superadmin para que tengas permisos completos
UPDATE public.profiles 
SET role = 'superadmin' 
WHERE email = 's.navarro@nrro.es';
