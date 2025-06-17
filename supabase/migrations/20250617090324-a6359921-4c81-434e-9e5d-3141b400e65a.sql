
-- Crear tabla para restaurantes base si no existe (mejorada)
CREATE TABLE IF NOT EXISTS public.base_restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  site_number TEXT NOT NULL UNIQUE,
  restaurant_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'España',
  restaurant_type TEXT DEFAULT 'traditional',
  square_meters INTEGER,
  seating_capacity INTEGER,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla para asignaciones de restaurantes a franquiciados si no existe
CREATE TABLE IF NOT EXISTS public.franchisee_restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchisee_id UUID REFERENCES public.franchisees(id) ON DELETE CASCADE,
  base_restaurant_id UUID REFERENCES public.base_restaurants(id) ON DELETE CASCADE,
  franchise_start_date DATE,
  franchise_end_date DATE,
  lease_start_date DATE,
  lease_end_date DATE,
  monthly_rent NUMERIC,
  franchise_fee_percentage NUMERIC DEFAULT 4.0,
  advertising_fee_percentage NUMERIC DEFAULT 4.0,
  last_year_revenue NUMERIC,
  average_monthly_sales NUMERIC,
  notes TEXT,
  status TEXT DEFAULT 'active',
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(franchisee_id, base_restaurant_id)
);

-- Habilitar RLS para todas las tablas
ALTER TABLE public.base_restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchisee_restaurants ENABLE ROW LEVEL SECURITY;

-- Políticas para base_restaurants
DROP POLICY IF EXISTS "Asesores pueden gestionar restaurantes base" ON public.base_restaurants;
DROP POLICY IF EXISTS "Franquiciados pueden ver restaurantes base" ON public.base_restaurants;
DROP POLICY IF EXISTS "Superadmins pueden gestionar restaurantes base" ON public.base_restaurants;

CREATE POLICY "Asesores pueden gestionar restaurantes base" 
  ON public.base_restaurants 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('advisor', 'asesor', 'admin', 'superadmin')
    )
  );

CREATE POLICY "Franquiciados pueden ver restaurantes base" 
  ON public.base_restaurants 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'franchisee'
    )
  );

-- Políticas para franchisee_restaurants
DROP POLICY IF EXISTS "Franquiciados pueden ver sus restaurantes asignados" ON public.franchisee_restaurants;
DROP POLICY IF EXISTS "Franquiciados pueden actualizar sus restaurantes asignados" ON public.franchisee_restaurants;
DROP POLICY IF EXISTS "Asesores pueden gestionar asignaciones de restaurantes" ON public.franchisee_restaurants;

CREATE POLICY "Franquiciados pueden ver sus restaurantes asignados" 
  ON public.franchisee_restaurants 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.franchisees 
      WHERE id = franchisee_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Franquiciados pueden actualizar sus restaurantes asignados" 
  ON public.franchisee_restaurants 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.franchisees 
      WHERE id = franchisee_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Asesores pueden gestionar asignaciones de restaurantes" 
  ON public.franchisee_restaurants 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('advisor', 'asesor', 'admin', 'superadmin')
    )
  );

-- Actualizar triggers si no existen
DROP TRIGGER IF EXISTS update_base_restaurants_updated_at ON public.base_restaurants;
DROP TRIGGER IF EXISTS update_franchisee_restaurants_updated_at ON public.franchisee_restaurants;

CREATE TRIGGER update_base_restaurants_updated_at
  BEFORE UPDATE ON public.base_restaurants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchisee_restaurants_updated_at
  BEFORE UPDATE ON public.franchisee_restaurants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
