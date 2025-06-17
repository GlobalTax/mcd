
-- Crear tabla para presupuestos anuales
CREATE TABLE public.annual_budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES franchisee_restaurants(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  jan NUMERIC DEFAULT 0,
  feb NUMERIC DEFAULT 0,
  mar NUMERIC DEFAULT 0,
  apr NUMERIC DEFAULT 0,
  may NUMERIC DEFAULT 0,
  jun NUMERIC DEFAULT 0,
  jul NUMERIC DEFAULT 0,
  aug NUMERIC DEFAULT 0,
  sep NUMERIC DEFAULT 0,
  oct NUMERIC DEFAULT 0,
  nov NUMERIC DEFAULT 0,
  dec NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES profiles(id),
  
  -- Índice único para evitar duplicados
  UNIQUE(restaurant_id, year, category, subcategory)
);

-- Agregar RLS (Row Level Security)
ALTER TABLE public.annual_budgets ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean datos de sus restaurantes
CREATE POLICY "Users can view annual budgets for their restaurants" 
  ON public.annual_budgets 
  FOR SELECT 
  USING (
    restaurant_id IN (
      SELECT fr.id 
      FROM franchisee_restaurants fr
      JOIN franchisees f ON f.id = fr.franchisee_id
      WHERE f.user_id = auth.uid()
    )
  );

-- Política para insertar
CREATE POLICY "Users can create annual budgets for their restaurants" 
  ON public.annual_budgets 
  FOR INSERT 
  WITH CHECK (
    restaurant_id IN (
      SELECT fr.id 
      FROM franchisee_restaurants fr
      JOIN franchisees f ON f.id = fr.franchisee_id
      WHERE f.user_id = auth.uid()
    )
  );

-- Política para actualizar
CREATE POLICY "Users can update annual budgets for their restaurants" 
  ON public.annual_budgets 
  FOR UPDATE 
  USING (
    restaurant_id IN (
      SELECT fr.id 
      FROM franchisee_restaurants fr
      JOIN franchisees f ON f.id = fr.franchisee_id
      WHERE f.user_id = auth.uid()
    )
  );

-- Política para eliminar
CREATE POLICY "Users can delete annual budgets for their restaurants" 
  ON public.annual_budgets 
  FOR DELETE 
  USING (
    restaurant_id IN (
      SELECT fr.id 
      FROM franchisee_restaurants fr
      JOIN franchisees f ON f.id = fr.franchisee_id
      WHERE f.user_id = auth.uid()
    )
  );

-- Trigger para actualizar updated_at
CREATE TRIGGER update_annual_budgets_updated_at
  BEFORE UPDATE ON public.annual_budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
