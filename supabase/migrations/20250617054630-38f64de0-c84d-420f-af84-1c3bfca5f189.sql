
-- Crear tabla para los datos históricos de P&L
CREATE TABLE public.profit_loss_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  
  -- Revenue Section
  net_sales DECIMAL(12,2) NOT NULL DEFAULT 0,
  other_revenue DECIMAL(12,2) DEFAULT 0,
  total_revenue DECIMAL(12,2) GENERATED ALWAYS AS (net_sales + COALESCE(other_revenue, 0)) STORED,
  
  -- Cost of Sales
  food_cost DECIMAL(12,2) DEFAULT 0,
  paper_cost DECIMAL(12,2) DEFAULT 0,
  total_cost_of_sales DECIMAL(12,2) GENERATED ALWAYS AS (COALESCE(food_cost, 0) + COALESCE(paper_cost, 0)) STORED,
  
  -- Labor Costs
  management_labor DECIMAL(12,2) DEFAULT 0,
  crew_labor DECIMAL(12,2) DEFAULT 0,
  benefits DECIMAL(12,2) DEFAULT 0,
  total_labor DECIMAL(12,2) GENERATED ALWAYS AS (COALESCE(management_labor, 0) + COALESCE(crew_labor, 0) + COALESCE(benefits, 0)) STORED,
  
  -- Operating Expenses
  rent DECIMAL(12,2) DEFAULT 0,
  utilities DECIMAL(12,2) DEFAULT 0,
  maintenance DECIMAL(12,2) DEFAULT 0,
  advertising DECIMAL(12,2) DEFAULT 0,
  insurance DECIMAL(12,2) DEFAULT 0,
  supplies DECIMAL(12,2) DEFAULT 0,
  other_expenses DECIMAL(12,2) DEFAULT 0,
  total_operating_expenses DECIMAL(12,2) GENERATED ALWAYS AS (
    COALESCE(rent, 0) + COALESCE(utilities, 0) + COALESCE(maintenance, 0) + 
    COALESCE(advertising, 0) + COALESCE(insurance, 0) + COALESCE(supplies, 0) + 
    COALESCE(other_expenses, 0)
  ) STORED,
  
  -- McDonald's Specific Fees
  franchise_fee DECIMAL(12,2) DEFAULT 0,
  advertising_fee DECIMAL(12,2) DEFAULT 0,
  rent_percentage DECIMAL(12,2) DEFAULT 0,
  total_mcdonalds_fees DECIMAL(12,2) GENERATED ALWAYS AS (
    COALESCE(franchise_fee, 0) + COALESCE(advertising_fee, 0) + COALESCE(rent_percentage, 0)
  ) STORED,
  
  -- Calculated Fields
  gross_profit DECIMAL(12,2) GENERATED ALWAYS AS (net_sales + COALESCE(other_revenue, 0) - COALESCE(food_cost, 0) - COALESCE(paper_cost, 0)) STORED,
  operating_income DECIMAL(12,2) GENERATED ALWAYS AS (
    net_sales + COALESCE(other_revenue, 0) - 
    COALESCE(food_cost, 0) - COALESCE(paper_cost, 0) - 
    COALESCE(management_labor, 0) - COALESCE(crew_labor, 0) - COALESCE(benefits, 0) - 
    COALESCE(rent, 0) - COALESCE(utilities, 0) - COALESCE(maintenance, 0) - 
    COALESCE(advertising, 0) - COALESCE(insurance, 0) - COALESCE(supplies, 0) - 
    COALESCE(other_expenses, 0) - COALESCE(franchise_fee, 0) - 
    COALESCE(advertising_fee, 0) - COALESCE(rent_percentage, 0)
  ) STORED,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT,
  notes TEXT,
  
  -- Constraints
  UNIQUE(restaurant_id, year, month)
);

-- Crear índices para optimizar consultas
CREATE INDEX idx_profit_loss_restaurant_year ON public.profit_loss_data(restaurant_id, year);
CREATE INDEX idx_profit_loss_date ON public.profit_loss_data(year, month);

-- Habilitar Row Level Security
ALTER TABLE public.profit_loss_data ENABLE ROW LEVEL SECURITY;

-- Política para que los franquiciados solo vean datos de sus restaurantes
CREATE POLICY "Users can view P&L data for their restaurants"
ON public.profit_loss_data
FOR SELECT
USING (
  restaurant_id IN (
    SELECT r.site_number::TEXT 
    FROM json_to_recordset(current_setting('app.user_restaurants', true)::json) 
    AS r(site_number TEXT)
  )
);

-- Política para insertar datos (solo administradores por ahora)
CREATE POLICY "Admins can insert P&L data"
ON public.profit_loss_data
FOR INSERT
WITH CHECK (true); -- Ajustar según sistema de roles

-- Política para actualizar datos
CREATE POLICY "Admins can update P&L data"
ON public.profit_loss_data
FOR UPDATE
USING (true); -- Ajustar según sistema de roles

-- Función para actualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar automáticamente updated_at
CREATE TRIGGER update_profit_loss_data_updated_at 
    BEFORE UPDATE ON public.profit_loss_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Crear tabla para plantillas de P&L (opcional)
CREATE TABLE public.profit_loss_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insertar plantilla básica
INSERT INTO public.profit_loss_templates (name, description, template_data, is_default)
VALUES (
  'McDonald''s Standard P&L',
  'Plantilla estándar para P&L de franquicias McDonald''s',
  '{
    "categories": {
      "revenue": ["net_sales", "other_revenue"],
      "cost_of_sales": ["food_cost", "paper_cost"],
      "labor": ["management_labor", "crew_labor", "benefits"],
      "operating_expenses": ["rent", "utilities", "maintenance", "advertising", "insurance", "supplies", "other_expenses"],
      "mcdonalds_fees": ["franchise_fee", "advertising_fee", "rent_percentage"]
    },
    "percentages": {
      "food_cost": 30,
      "labor": 25,
      "rent": 6
    }
  }',
  true
);
