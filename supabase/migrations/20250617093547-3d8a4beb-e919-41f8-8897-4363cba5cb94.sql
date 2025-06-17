
-- Eliminar políticas existentes y crear nuevas más específicas
DROP POLICY IF EXISTS "Asesores pueden gestionar restaurantes base" ON public.base_restaurants;
DROP POLICY IF EXISTS "Franquiciados pueden ver restaurantes base" ON public.base_restaurants;
DROP POLICY IF EXISTS "Superadmins pueden gestionar restaurantes base" ON public.base_restaurants;

-- Crear política para superadmins, admins y asesores
CREATE POLICY "Superadmins y asesores pueden gestionar restaurantes base" 
  ON public.base_restaurants 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('advisor', 'asesor', 'admin', 'superadmin')
    )
  );

-- Crear política separada para franquiciados (solo lectura)
CREATE POLICY "Franquiciados pueden ver restaurantes base" 
  ON public.base_restaurants 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'franchisee'
    )
  );
