
-- Crear tabla para presupuestos de valoración
CREATE TABLE public.valuation_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchisee_restaurant_id UUID REFERENCES public.franchisee_restaurants(id),
  budget_name TEXT NOT NULL,
  budget_year INTEGER NOT NULL,
  
  -- Parámetros de valoración
  initial_sales NUMERIC NOT NULL,
  sales_growth_rate NUMERIC DEFAULT 0,
  inflation_rate NUMERIC DEFAULT 0,
  discount_rate NUMERIC NOT NULL,
  years_projection INTEGER DEFAULT 5,
  
  -- Costos como porcentaje de ventas
  pac_percentage NUMERIC DEFAULT 0,
  rent_percentage NUMERIC DEFAULT 0,
  service_fees_percentage NUMERIC DEFAULT 0,
  
  -- Costos fijos anuales
  depreciation NUMERIC DEFAULT 0,
  interest NUMERIC DEFAULT 0,
  loan_payment NUMERIC DEFAULT 0,
  rent_index NUMERIC DEFAULT 0,
  miscellaneous NUMERIC DEFAULT 0,
  
  -- Resultados calculados
  final_valuation NUMERIC,
  projected_cash_flows JSONB,
  
  -- Metadatos
  status TEXT DEFAULT 'draft',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.valuation_budgets ENABLE ROW LEVEL SECURITY;

-- Política para que los franquiciados vean solo sus presupuestos
CREATE POLICY "Franchisees can view their own valuation budgets" 
  ON public.valuation_budgets 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.franchisee_restaurants fr
      JOIN public.franchisees f ON f.id = fr.franchisee_id
      WHERE fr.id = franchisee_restaurant_id 
      AND f.user_id = auth.uid()
    )
  );

-- Política para crear presupuestos
CREATE POLICY "Franchisees can create their own valuation budgets" 
  ON public.valuation_budgets 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.franchisee_restaurants fr
      JOIN public.franchisees f ON f.id = fr.franchisee_id
      WHERE fr.id = franchisee_restaurant_id 
      AND f.user_id = auth.uid()
    )
  );

-- Política para actualizar presupuestos
CREATE POLICY "Franchisees can update their own valuation budgets" 
  ON public.valuation_budgets 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.franchisee_restaurants fr
      JOIN public.franchisees f ON f.id = fr.franchisee_id
      WHERE fr.id = franchisee_restaurant_id 
      AND f.user_id = auth.uid()
    )
  );

-- Política para eliminar presupuestos
CREATE POLICY "Franchisees can delete their own valuation budgets" 
  ON public.valuation_budgets 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.franchisee_restaurants fr
      JOIN public.franchisees f ON f.id = fr.franchisee_id
      WHERE fr.id = franchisee_restaurant_id 
      AND f.user_id = auth.uid()
    )
  );

-- Trigger para actualizar updated_at
CREATE TRIGGER update_valuation_budgets_updated_at
  BEFORE UPDATE ON public.valuation_budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_valuation_budgets_restaurant_id ON public.valuation_budgets(franchisee_restaurant_id);
CREATE INDEX idx_valuation_budgets_created_by ON public.valuation_budgets(created_by);
CREATE INDEX idx_valuation_budgets_year ON public.valuation_budgets(budget_year);
