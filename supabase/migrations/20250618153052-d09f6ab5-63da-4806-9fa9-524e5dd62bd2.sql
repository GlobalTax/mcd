
-- Eliminar todas las políticas problemáticas que causan recursión infinita
DROP POLICY IF EXISTS "Enable read access for users to own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users to own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable all access for admins" ON public.profiles;

-- Crear una función de seguridad para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Crear políticas más simples que no causen recursión
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles  
  FOR UPDATE USING (auth.uid() = id);

-- Política para permitir inserción de nuevos perfiles
CREATE POLICY "Allow profile creation" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Política para service role (necesaria para admin.createUser)
CREATE POLICY "Service role can manage all profiles" ON public.profiles
  FOR ALL TO service_role USING (true);

-- Política alternativa para admins usando función segura
CREATE POLICY "Admins can manage profiles" ON public.profiles
  FOR ALL USING (
    CASE 
      WHEN auth.uid() IS NULL THEN false
      ELSE public.get_current_user_role() IN ('admin', 'advisor', 'asesor', 'superadmin')
    END
  );

-- Asegurar que la tabla tiene RLS habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
