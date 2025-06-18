
-- Revisar y configurar políticas RLS para la tabla profiles
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Crear políticas más permisivas para resolving el problema
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para que admins y asesores puedan gestionar todos los perfiles
CREATE POLICY "Admins can manage all profiles" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'advisor', 'asesor', 'superadmin')
    )
  );

-- Política para insertar nuevos perfiles (necesaria para la creación de usuarios)
CREATE POLICY "Allow profile creation" ON public.profiles
  FOR INSERT WITH CHECK (true);

-- Revisar políticas de la tabla franchisees
DROP POLICY IF EXISTS "Advisors can manage franchisees" ON public.franchisees;
DROP POLICY IF EXISTS "Franchisees can view own data" ON public.franchisees;

CREATE POLICY "Advisors can manage franchisees" ON public.franchisees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'advisor', 'asesor', 'superadmin')
    )
  );

CREATE POLICY "Franchisees can view own data" ON public.franchisees
  FOR SELECT USING (user_id = auth.uid());

-- Revisar políticas de invitaciones de franquiciados
DROP POLICY IF EXISTS "Advisors can manage all invitations" ON public.franchisee_invitations;
DROP POLICY IF EXISTS "Franchisees can view their own invitations" ON public.franchisee_invitations;

CREATE POLICY "Advisors can manage all invitations" ON public.franchisee_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'advisor', 'asesor', 'superadmin')
    )
  );

CREATE POLICY "Franchisees can view their own invitations" ON public.franchisee_invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.franchisees f
      JOIN public.profiles p ON f.user_id = p.id
      WHERE f.id = franchisee_id 
      AND p.id = auth.uid()
    )
  );

-- Asegurar que RLS está habilitado en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchisees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchisee_invitations ENABLE ROW LEVEL SECURITY;

-- Mejorar la función de creación de perfiles para manejar conflictos
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
    role = EXCLUDED.role,
    updated_at = now();
END;
$$;
