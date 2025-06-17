
-- Actualizar el tipo de rol para incluir 'asesor'
-- Primero, necesitamos recrear el tipo de enum si existe, o actualizar la columna
-- Como estamos usando text en lugar de enum, solo necesitamos actualizar las validaciones si las hay

-- Actualizar cualquier constraint existente en la tabla profiles para incluir 'asesor'
-- Si no existe constraint, este comando no hará nada
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Agregar un nuevo constraint que incluya el rol 'asesor'
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('admin', 'franchisee', 'manager', 'asesor'));

-- Actualizar el valor por defecto si es necesario (mantener 'franchisee' como default)
-- No es necesario cambiar el default, pero podemos verificar que está correcto
