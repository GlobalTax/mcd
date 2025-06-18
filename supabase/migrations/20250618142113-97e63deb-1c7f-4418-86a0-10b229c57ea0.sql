
-- Crear función para crear perfiles de franquiciados con privilegios elevados
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
  -- Insertar el perfil en la tabla profiles
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
  );
END;
$$;
