
-- Eliminar las políticas problemáticas que causan recursión infinita
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;

-- Crear función de seguridad para obtener el rol del usuario actual
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

-- Política para que admins puedan gestionar perfiles usando la función segura
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

-- Actualizar la función de creación de perfiles para ser más robusta
CREATE OR REPLACE FUNCTION public.create_franchisee_profile(
  user_id UUID,
  user_email TEXT,
  user_full_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insertar el perfil en la tabla profiles, manejando conflictos
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role
  ) VALUES (
    user_id,
    user_email,
    user_full_name,
    'franchisee'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = COALESCE(EXCLUDED.role, profiles.role),
    updated_at = now();
    
  EXCEPTION
    WHEN OTHERS THEN
      RAISE LOG 'Error in create_franchisee_profile: %', SQLERRM;
      RAISE;
END;
$$;
