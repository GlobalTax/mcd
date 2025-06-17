
-- Actualizar el constraint para incluir el nuevo rol 'asistente'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Agregar un nuevo constraint que incluya todos los roles incluyendo 'asistente'
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'franchisee', 'manager', 'asesor', 'asistente'));
