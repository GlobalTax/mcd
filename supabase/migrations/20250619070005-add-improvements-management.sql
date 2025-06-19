-- Crear tabla para mejoras
CREATE TABLE IF NOT EXISTS public.improvements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('operational', 'financial', 'customer', 'technology', 'process')),
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'in_progress', 'completed', 'cancelled')),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL,
    estimated_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    actual_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    estimated_roi DECIMAL(5,2) NOT NULL DEFAULT 0,
    actual_roi DECIMAL(5,2) NOT NULL DEFAULT 0,
    implementation_date DATE NOT NULL,
    completion_date DATE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metrics JSONB DEFAULT '{}'::jsonb
);

-- Crear tabla para planes de mejora
CREATE TABLE IF NOT EXISTS public.improvement_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    target_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
    total_estimated_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_estimated_roi DECIMAL(5,2) NOT NULL DEFAULT 0,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de relación entre planes y mejoras
CREATE TABLE IF NOT EXISTS public.improvement_plan_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_id UUID REFERENCES public.improvement_plans(id) ON DELETE CASCADE,
    improvement_id UUID REFERENCES public.improvements(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, improvement_id)
);

-- Crear tabla para seguimiento de métricas de mejora
CREATE TABLE IF NOT EXISTS public.improvement_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    improvement_id UUID REFERENCES public.improvements(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL,
    revenue_impact DECIMAL(10,2) NOT NULL DEFAULT 0,
    cost_savings DECIMAL(10,2) NOT NULL DEFAULT 0,
    efficiency_gain DECIMAL(5,2) NOT NULL DEFAULT 0,
    customer_satisfaction DECIMAL(3,1) NOT NULL DEFAULT 0,
    employee_satisfaction DECIMAL(3,1) NOT NULL DEFAULT 0,
    time_savings INTEGER NOT NULL DEFAULT 0,
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(improvement_id, metric_date)
);

-- Crear tabla para comentarios y seguimiento de mejoras
CREATE TABLE IF NOT EXISTS public.improvement_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    improvement_id UUID REFERENCES public.improvements(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_improvements_created_by ON public.improvements(created_by);
CREATE INDEX IF NOT EXISTS idx_improvements_status ON public.improvements(status);
CREATE INDEX IF NOT EXISTS idx_improvements_category ON public.improvements(category);
CREATE INDEX IF NOT EXISTS idx_improvements_priority ON public.improvements(priority);
CREATE INDEX IF NOT EXISTS idx_improvements_restaurant_id ON public.improvements(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_improvements_implementation_date ON public.improvements(implementation_date);
CREATE INDEX IF NOT EXISTS idx_improvement_plans_created_by ON public.improvement_plans(created_by);
CREATE INDEX IF NOT EXISTS idx_improvement_plans_status ON public.improvement_plans(status);
CREATE INDEX IF NOT EXISTS idx_improvement_plans_target_date ON public.improvement_plans(target_date);
CREATE INDEX IF NOT EXISTS idx_improvement_plan_items_plan_id ON public.improvement_plan_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_improvement_plan_items_improvement_id ON public.improvement_plan_items(improvement_id);
CREATE INDEX IF NOT EXISTS idx_improvement_metrics_improvement_id ON public.improvement_metrics(improvement_id);
CREATE INDEX IF NOT EXISTS idx_improvement_metrics_metric_date ON public.improvement_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_improvement_comments_improvement_id ON public.improvement_comments(improvement_id);
CREATE INDEX IF NOT EXISTS idx_improvement_comments_created_by ON public.improvement_comments(created_by);

-- Triggers para actualizar updated_at
CREATE TRIGGER update_improvements_updated_at 
    BEFORE UPDATE ON public.improvements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_improvement_plans_updated_at 
    BEFORE UPDATE ON public.improvement_plans 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS
ALTER TABLE public.improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.improvement_comments ENABLE ROW LEVEL SECURITY;

-- Políticas para mejoras
CREATE POLICY "Users can view improvements they created" ON public.improvements
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can view improvements for their restaurants" ON public.improvements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.restaurants r
            JOIN public.franchisee_restaurants fr ON r.id = fr.restaurant_id
            WHERE r.id = improvements.restaurant_id
            AND fr.franchisee_id = (
                SELECT franchisee_id FROM public.profiles WHERE id = auth.uid()
            )
        )
    );

CREATE POLICY "Admins can view all improvements" ON public.improvements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin', 'asesor')
        )
    );

CREATE POLICY "Users can create improvements" ON public.improvements
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own improvements" ON public.improvements
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Admins can update any improvement" ON public.improvements
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin', 'asesor')
        )
    );

CREATE POLICY "Users can delete their own improvements" ON public.improvements
    FOR DELETE USING (auth.uid() = created_by);

-- Políticas para planes de mejora
CREATE POLICY "Users can view plans they created" ON public.improvement_plans
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all plans" ON public.improvement_plans
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin', 'asesor')
        )
    );

CREATE POLICY "Users can create plans" ON public.improvement_plans
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own plans" ON public.improvement_plans
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own plans" ON public.improvement_plans
    FOR DELETE USING (auth.uid() = created_by);

-- Políticas para elementos de planes
CREATE POLICY "Users can view plan items for their plans" ON public.improvement_plan_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.improvement_plans 
            WHERE id = improvement_plan_items.plan_id 
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Admins can view all plan items" ON public.improvement_plan_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin', 'asesor')
        )
    );

-- Políticas para métricas
CREATE POLICY "Users can view metrics for their improvements" ON public.improvement_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.improvements 
            WHERE id = improvement_metrics.improvement_id 
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can create metrics for their improvements" ON public.improvement_metrics
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.improvements 
            WHERE id = improvement_metrics.improvement_id 
            AND created_by = auth.uid()
        )
    );

-- Políticas para comentarios
CREATE POLICY "Users can view comments for improvements they can see" ON public.improvement_comments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.improvements 
            WHERE id = improvement_comments.improvement_id 
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Users can create comments" ON public.improvement_comments
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Función para calcular ROI automáticamente
CREATE OR REPLACE FUNCTION calculate_improvement_roi()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.actual_cost > 0 THEN
        NEW.actual_roi = ((NEW.metrics->>'revenue_impact')::DECIMAL + (NEW.metrics->>'cost_savings')::DECIMAL - NEW.actual_cost) / NEW.actual_cost * 100;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_roi
    BEFORE UPDATE ON public.improvements
    FOR EACH ROW
    EXECUTE FUNCTION calculate_improvement_roi();

-- Función para actualizar costos totales de planes
CREATE OR REPLACE FUNCTION update_plan_totals()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.improvement_plans 
        SET 
            total_estimated_cost = (
                SELECT COALESCE(SUM(i.estimated_cost), 0)
                FROM public.improvements i
                JOIN public.improvement_plan_items ipi ON i.id = ipi.improvement_id
                WHERE ipi.plan_id = NEW.plan_id
            ),
            total_estimated_roi = (
                SELECT COALESCE(AVG(i.estimated_roi), 0)
                FROM public.improvements i
                JOIN public.improvement_plan_items ipi ON i.id = ipi.improvement_id
                WHERE ipi.plan_id = NEW.plan_id
            )
        WHERE id = NEW.plan_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.improvement_plans 
        SET 
            total_estimated_cost = (
                SELECT COALESCE(SUM(i.estimated_cost), 0)
                FROM public.improvements i
                JOIN public.improvement_plan_items ipi ON i.id = ipi.improvement_id
                WHERE ipi.plan_id = OLD.plan_id
            ),
            total_estimated_roi = (
                SELECT COALESCE(AVG(i.estimated_roi), 0)
                FROM public.improvements i
                JOIN public.improvement_plan_items ipi ON i.id = ipi.improvement_id
                WHERE ipi.plan_id = OLD.plan_id
            )
        WHERE id = OLD.plan_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_plan_totals
    AFTER INSERT OR UPDATE OR DELETE ON public.improvement_plan_items
    FOR EACH ROW
    EXECUTE FUNCTION update_plan_totals(); 