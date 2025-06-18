
-- Crear políticas RLS para la tabla franchisee_restaurants
-- Primero eliminar políticas existentes que puedan estar causando problemas
DROP POLICY IF EXISTS "Franchisees can manage own restaurants" ON public.franchisee_restaurants;
DROP POLICY IF EXISTS "Advisors can manage all restaurant assignments" ON public.franchisee_restaurants;

-- Crear nuevas políticas más permisivas
-- Política para que franquiciados puedan ver sus propios restaurantes asignados
CREATE POLICY "Franchisees can view own assigned restaurants" ON public.franchisee_restaurants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.franchisees f
      WHERE f.id = franchisee_id 
      AND f.user_id = auth.uid()
    )
  );

-- Política para que franquiciados puedan insertar asignaciones (necesario para auto-asignación)
CREATE POLICY "Franchisees can insert restaurant assignments" ON public.franchisee_restaurants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.franchisees f
      WHERE f.id = franchisee_id 
      AND f.user_id = auth.uid()
    )
  );

-- Política para que asesores puedan gestionar todas las asignaciones
CREATE POLICY "Advisors can manage all restaurant assignments" ON public.franchisee_restaurants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('admin', 'advisor', 'asesor', 'superadmin')
    )
  );

-- Asegurar que RLS está habilitado
ALTER TABLE public.franchisee_restaurants ENABLE ROW LEVEL SECURITY;
