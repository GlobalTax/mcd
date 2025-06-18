
-- Crear tabla para valoraciones de restaurantes
CREATE TABLE public.restaurant_valuations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id TEXT NOT NULL,
  restaurant_name TEXT NOT NULL,
  valuation_name TEXT NOT NULL DEFAULT 'Valoración Base',
  valuation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Datos del contrato de franquicia
  change_date DATE,
  franchise_end_date DATE,
  remaining_years NUMERIC,
  
  -- Parámetros del modelo
  inflation_rate NUMERIC NOT NULL DEFAULT 1.5,
  discount_rate NUMERIC NOT NULL DEFAULT 21.0,
  growth_rate NUMERIC NOT NULL DEFAULT 3.0,
  
  -- Datos por año (JSON array)
  yearly_data JSONB NOT NULL DEFAULT '[]',
  
  -- Resultados calculados
  total_present_value NUMERIC,
  projections JSONB,
  
  -- Metadatos
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users,
  
  -- Índices para búsquedas rápidas
  CONSTRAINT unique_restaurant_valuation UNIQUE (restaurant_id, valuation_name)
);

-- Crear tabla para escenarios de valoración
CREATE TABLE public.valuation_scenarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  valuation_id UUID NOT NULL REFERENCES public.restaurant_valuations(id) ON DELETE CASCADE,
  scenario_name TEXT NOT NULL,
  scenario_description TEXT,
  
  -- Modificadores del escenario (diferencias respecto al caso base)
  inflation_rate_modifier NUMERIC DEFAULT 0,
  discount_rate_modifier NUMERIC DEFAULT 0,
  growth_rate_modifier NUMERIC DEFAULT 0,
  
  -- Modificadores por año (JSON)
  yearly_modifications JSONB DEFAULT '{}',
  
  -- Resultados del escenario
  total_present_value NUMERIC,
  projections JSONB,
  variance_from_base NUMERIC,
  variance_percentage NUMERIC,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT unique_scenario_per_valuation UNIQUE (valuation_id, scenario_name)
);

-- Habilitar RLS
ALTER TABLE public.restaurant_valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valuation_scenarios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para restaurant_valuations
CREATE POLICY "Users can view all restaurant valuations" 
  ON public.restaurant_valuations 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create restaurant valuations" 
  ON public.restaurant_valuations 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own restaurant valuations" 
  ON public.restaurant_valuations 
  FOR UPDATE 
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own restaurant valuations" 
  ON public.restaurant_valuations 
  FOR DELETE 
  USING (created_by = auth.uid());

-- Políticas RLS para valuation_scenarios
CREATE POLICY "Users can view all valuation scenarios" 
  ON public.valuation_scenarios 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create valuation scenarios" 
  ON public.valuation_scenarios 
  FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update valuation scenarios" 
  ON public.valuation_scenarios 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Users can delete valuation scenarios" 
  ON public.valuation_scenarios 
  FOR DELETE 
  USING (true);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_restaurant_valuations_updated_at 
  BEFORE UPDATE ON public.restaurant_valuations 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_valuation_scenarios_updated_at 
  BEFORE UPDATE ON public.valuation_scenarios 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
