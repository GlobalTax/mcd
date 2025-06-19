-- Crear tabla para reportes
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('executive', 'operational', 'financial', 'custom')),
    category TEXT NOT NULL,
    data_source TEXT NOT NULL,
    schedule TEXT NOT NULL DEFAULT 'manual' CHECK (schedule IN ('daily', 'weekly', 'monthly', 'quarterly', 'manual')),
    last_generated TIMESTAMP WITH TIME ZONE,
    next_generation TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    parameters JSONB DEFAULT '{}'::jsonb
);

-- Crear tabla para dashboards
CREATE TABLE IF NOT EXISTS public.dashboards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('executive', 'franchisee', 'advisor', 'custom')),
    created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    layout JSONB DEFAULT '{}'::jsonb
);

-- Crear tabla para widgets de dashboard
CREATE TABLE IF NOT EXISTS public.dashboard_widgets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    dashboard_id UUID REFERENCES public.dashboards(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('chart', 'metric', 'table', 'kpi')),
    title TEXT NOT NULL,
    data_source TEXT NOT NULL,
    position JSONB NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para templates de reportes
CREATE TABLE IF NOT EXISTS public.report_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    parameters JSONB DEFAULT '{}'::jsonb,
    sample_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para programación de reportes
CREATE TABLE IF NOT EXISTS public.report_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    schedule TEXT NOT NULL CHECK (schedule IN ('daily', 'weekly', 'monthly', 'quarterly')),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para historial de reportes generados
CREATE TABLE IF NOT EXISTS public.report_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    generated_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_path TEXT,
    file_size INTEGER,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    parameters JSONB DEFAULT '{}'::jsonb
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_reports_created_by ON public.reports(created_by);
CREATE INDEX IF NOT EXISTS idx_reports_type ON public.reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_schedule ON public.reports(schedule);
CREATE INDEX IF NOT EXISTS idx_dashboards_created_by ON public.dashboards(created_by);
CREATE INDEX IF NOT EXISTS idx_dashboards_type ON public.dashboards(type);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_dashboard_id ON public.dashboard_widgets(dashboard_id);
CREATE INDEX IF NOT EXISTS idx_report_templates_category ON public.report_templates(category);
CREATE INDEX IF NOT EXISTS idx_report_schedules_report_id ON public.report_schedules(report_id);
CREATE INDEX IF NOT EXISTS idx_report_schedules_user_id ON public.report_schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_report_history_report_id ON public.report_history(report_id);
CREATE INDEX IF NOT EXISTS idx_report_history_generated_by ON public.report_history(generated_by);
CREATE INDEX IF NOT EXISTS idx_report_history_generated_at ON public.report_history(generated_at);

-- Triggers para actualizar updated_at
CREATE TRIGGER update_reports_updated_at 
    BEFORE UPDATE ON public.reports 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboards_updated_at 
    BEFORE UPDATE ON public.dashboards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dashboard_widgets_updated_at 
    BEFORE UPDATE ON public.dashboard_widgets 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_templates_updated_at 
    BEFORE UPDATE ON public.report_templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_schedules_updated_at 
    BEFORE UPDATE ON public.report_schedules 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_history ENABLE ROW LEVEL SECURITY;

-- Políticas para reportes
CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all reports" ON public.reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Users can create their own reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own reports" ON public.reports
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own reports" ON public.reports
    FOR DELETE USING (auth.uid() = created_by);

-- Políticas para dashboards
CREATE POLICY "Users can view their own dashboards" ON public.dashboards
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all dashboards" ON public.dashboards
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Users can create their own dashboards" ON public.dashboards
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own dashboards" ON public.dashboards
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own dashboards" ON public.dashboards
    FOR DELETE USING (auth.uid() = created_by);

-- Políticas para widgets
CREATE POLICY "Users can view widgets of their dashboards" ON public.dashboard_widgets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.dashboards 
            WHERE id = dashboard_widgets.dashboard_id 
            AND created_by = auth.uid()
        )
    );

CREATE POLICY "Admins can view all widgets" ON public.dashboard_widgets
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

-- Políticas para templates (lectura pública, escritura solo admins)
CREATE POLICY "Everyone can view report templates" ON public.report_templates
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage report templates" ON public.report_templates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

-- Políticas para programación de reportes
CREATE POLICY "Users can view their own report schedules" ON public.report_schedules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own report schedules" ON public.report_schedules
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own report schedules" ON public.report_schedules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own report schedules" ON public.report_schedules
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para historial de reportes
CREATE POLICY "Users can view their own report history" ON public.report_history
    FOR SELECT USING (auth.uid() = generated_by);

CREATE POLICY "Admins can view all report history" ON public.report_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

-- Función para generar reportes automáticamente
CREATE OR REPLACE FUNCTION generate_scheduled_reports()
RETURNS void AS $$
DECLARE
    report_record RECORD;
BEGIN
    FOR report_record IN 
        SELECT r.* 
        FROM public.reports r 
        WHERE r.status = 'active' 
        AND r.next_generation <= NOW()
    LOOP
        -- Insertar en historial de reportes
        INSERT INTO public.report_history (
            report_id, 
            generated_by, 
            status, 
            parameters
        ) VALUES (
            report_record.id,
            report_record.created_by,
            'pending',
            report_record.parameters
        );
        
        -- Actualizar próxima generación
        UPDATE public.reports 
        SET 
            last_generated = NOW(),
            next_generation = CASE 
                WHEN schedule = 'daily' THEN NOW() + INTERVAL '1 day'
                WHEN schedule = 'weekly' THEN NOW() + INTERVAL '1 week'
                WHEN schedule = 'monthly' THEN NOW() + INTERVAL '1 month'
                WHEN schedule = 'quarterly' THEN NOW() + INTERVAL '3 months'
                ELSE NOW()
            END
        WHERE id = report_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql; 