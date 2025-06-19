-- Crear tabla para escenarios de valoración DCF
CREATE TABLE IF NOT EXISTS public.valuation_scenarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES public.franchisee_restaurants(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    scenario_data JSONB NOT NULL,
    calculated_value DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_valuation_scenarios_user_id ON public.valuation_scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_valuation_scenarios_restaurant_id ON public.valuation_scenarios(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_valuation_scenarios_created_at ON public.valuation_scenarios(created_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_valuation_scenarios_updated_at 
    BEFORE UPDATE ON public.valuation_scenarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS
ALTER TABLE public.valuation_scenarios ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios vean solo sus escenarios
CREATE POLICY "Users can view their own valuation scenarios" ON public.valuation_scenarios
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios inserten sus propios escenarios
CREATE POLICY "Users can insert their own valuation scenarios" ON public.valuation_scenarios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios actualicen sus propios escenarios
CREATE POLICY "Users can update their own valuation scenarios" ON public.valuation_scenarios
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para que los usuarios eliminen sus propios escenarios
CREATE POLICY "Users can delete their own valuation scenarios" ON public.valuation_scenarios
    FOR DELETE USING (auth.uid() = user_id);

-- Política para que los asesores vean los escenarios de sus franquiciados
CREATE POLICY "Advisors can view their franchisees valuation scenarios" ON public.valuation_scenarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'asesor'
        )
    );

-- Política para que los admins vean todos los escenarios
CREATE POLICY "Admins can view all valuation scenarios" ON public.valuation_scenarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    ); 