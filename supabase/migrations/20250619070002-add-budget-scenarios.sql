-- Crear tabla para escenarios de presupuesto
CREATE TABLE IF NOT EXISTS public.budget_scenarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES public.franchisee_restaurants(id) ON DELETE CASCADE,
    scenario_name TEXT NOT NULL,
    scenario_data JSONB NOT NULL,
    total_budget DECIMAL(15,2) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_budget_scenarios_user_id ON public.budget_scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_budget_scenarios_restaurant_id ON public.budget_scenarios(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_budget_scenarios_year_month ON public.budget_scenarios(year, month);
CREATE INDEX IF NOT EXISTS idx_budget_scenarios_created_at ON public.budget_scenarios(created_at);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_budget_scenarios_updated_at 
    BEFORE UPDATE ON public.budget_scenarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS
ALTER TABLE public.budget_scenarios ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios vean solo sus escenarios
CREATE POLICY "Users can view their own budget scenarios" ON public.budget_scenarios
    FOR SELECT USING (auth.uid() = user_id);

-- Política para que los usuarios inserten sus propios escenarios
CREATE POLICY "Users can insert their own budget scenarios" ON public.budget_scenarios
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios actualicen sus propios escenarios
CREATE POLICY "Users can update their own budget scenarios" ON public.budget_scenarios
    FOR UPDATE USING (auth.uid() = user_id);

-- Política para que los usuarios eliminen sus propios escenarios
CREATE POLICY "Users can delete their own budget scenarios" ON public.budget_scenarios
    FOR DELETE USING (auth.uid() = user_id);

-- Política para que los asesores vean los escenarios de sus franquiciados
CREATE POLICY "Advisors can view their franchisees budget scenarios" ON public.budget_scenarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'asesor'
        )
    );

-- Política para que los admins vean todos los escenarios
CREATE POLICY "Admins can view all budget scenarios" ON public.budget_scenarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    ); 