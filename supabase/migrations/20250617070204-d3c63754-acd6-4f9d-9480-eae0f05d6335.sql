
-- Crear tabla para restaurantes base (añadidos por el Asesor)
CREATE TABLE public.base_restaurants (
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

-- Crear tabla para asignaciones de restaurantes a franquiciados
CREATE TABLE public.franchisee_restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchisee_id UUID REFERENCES public.franchisees(id) ON DELETE CASCADE,
  base_restaurant_id UUID REFERENCES public.base_restaurants(id) ON DELETE CASCADE,
  -- Información específica del franquiciado
  franchise_start_date DATE,
  franchise_end_date DATE,
  lease_start_date DATE,
  lease_end_date DATE,
  monthly_rent NUMERIC,
  franchise_fee_percentage NUMERIC DEFAULT 4.0,
  advertising_fee_percentage NUMERIC DEFAULT 4.0,
  -- Información operativa
  last_year_revenue NUMERIC,
  average_monthly_sales NUMERIC,
  notes TEXT,
  status TEXT DEFAULT 'active',
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(franchisee_id, base_restaurant_id)
);

-- Crear tabla para presupuestos por restaurante
CREATE TABLE public.restaurant_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchisee_restaurant_id UUID REFERENCES public.franchisee_restaurants(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  -- Presupuesto anual
  budgeted_revenue NUMERIC NOT NULL,
  budgeted_food_cost NUMERIC,
  budgeted_labor_cost NUMERIC,
  budgeted_rent NUMERIC,
  budgeted_utilities NUMERIC,
  budgeted_marketing NUMERIC,
  budgeted_other_expenses NUMERIC,
  -- Metas mensuales
  monthly_revenue_target NUMERIC,
  monthly_profit_target NUMERIC,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(franchisee_restaurant_id, year)
);

-- Crear tabla para seguimiento mensual
CREATE TABLE public.monthly_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchisee_restaurant_id UUID REFERENCES public.franchisee_restaurants(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  -- Datos reales vs presupuesto
  actual_revenue NUMERIC,
  actual_food_cost NUMERIC,
  actual_labor_cost NUMERIC,
  actual_rent NUMERIC,
  actual_utilities NUMERIC,
  actual_marketing NUMERIC,
  actual_other_expenses NUMERIC,
  -- Métricas operativas
  customer_count INTEGER,
  average_ticket NUMERIC,
  labor_hours INTEGER,
  -- Notas y observaciones
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(franchisee_restaurant_id, year, month)
);

-- Habilitar RLS para todas las tablas
ALTER TABLE public.base_restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchisee_restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_tracking ENABLE ROW LEVEL SECURITY;

-- Políticas para base_restaurants (solo Asesores pueden crear/editar)
CREATE POLICY "Asesores pueden gestionar restaurantes base" 
  ON public.base_restaurants 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'advisor'
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
      WHERE id = auth.uid() AND role = 'advisor'
    )
  );

-- Políticas para restaurant_budgets
CREATE POLICY "Franquiciados pueden gestionar presupuestos de sus restaurantes" 
  ON public.restaurant_budgets 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.franchisee_restaurants fr
      JOIN public.franchisees f ON f.id = fr.franchisee_id
      WHERE fr.id = franchisee_restaurant_id AND f.user_id = auth.uid()
    )
  );

-- Políticas para monthly_tracking
CREATE POLICY "Franquiciados pueden gestionar seguimiento de sus restaurantes" 
  ON public.monthly_tracking 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.franchisee_restaurants fr
      JOIN public.franchisees f ON f.id = fr.franchisee_id
      WHERE fr.id = franchisee_restaurant_id AND f.user_id = auth.uid()
    )
  );

-- Actualizar el trigger de updated_at para las nuevas tablas
CREATE TRIGGER update_base_restaurants_updated_at
  BEFORE UPDATE ON public.base_restaurants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_franchisee_restaurants_updated_at
  BEFORE UPDATE ON public.franchisee_restaurants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurant_budgets_updated_at
  BEFORE UPDATE ON public.restaurant_budgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_monthly_tracking_updated_at
  BEFORE UPDATE ON public.monthly_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
