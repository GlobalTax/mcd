
-- Primero, vamos a limpiar y recrear las políticas problemáticas

-- Eliminar políticas existentes que pueden causar conflictos
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;

-- Recrear políticas más simples y funcionales
CREATE POLICY "Enable read access for users to own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable update for users to own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Política para permitir inserción de nuevos perfiles (crítica para crear usuarios)
CREATE POLICY "Enable insert for authenticated users" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

-- Política para que admins puedan gestionar todos los perfiles
CREATE POLICY "Enable all access for admins" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'asesor', 'advisor')
    )
  );

-- Asegurar que las políticas de invitaciones también funcionen correctamente
DROP POLICY IF EXISTS "Advisors can manage all invitations" ON public.franchisee_invitations;
DROP POLICY IF EXISTS "Franchisees can view their own invitations" ON public.franchisee_invitations;

CREATE POLICY "Enable all access for advisors on invitations" ON public.franchisee_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'asesor', 'advisor')
    )
  );

CREATE POLICY "Enable read access for franchisees to own invitations" ON public.franchisee_invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.franchisees f
      WHERE f.id = franchisee_id 
      AND f.user_id = auth.uid()
    )
  );

-- Revisar y simplificar políticas de franquiciados
DROP POLICY IF EXISTS "Advisors can manage franchisees" ON public.franchisees;
DROP POLICY IF EXISTS "Franchisees can view own data" ON public.franchisees;

CREATE POLICY "Enable all access for advisors on franchisees" ON public.franchisees
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'asesor', 'advisor')
    )
  );

CREATE POLICY "Enable read access for franchisees to own data" ON public.franchisees
  FOR SELECT USING (user_id = auth.uid());

-- Asegurar que RLS está habilitado
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchisees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchisee_invitations ENABLE ROW LEVEL SECURITY;
