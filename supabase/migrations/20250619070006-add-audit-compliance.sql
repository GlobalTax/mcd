-- Crear tabla para logs de auditoría
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL CHECK (resource_type IN ('user', 'restaurant', 'franchisee', 'valuation', 'budget', 'report', 'system')),
    resource_id TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'failure', 'warning'))
);

-- Crear tabla para reglas de compliance
CREATE TABLE IF NOT EXISTS public.compliance_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('security', 'data_protection', 'financial', 'operational', 'regulatory')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'inactive', 'draft')),
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    last_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    next_check TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    compliance_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    violations_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rule_config JSONB DEFAULT '{}'::jsonb
);

-- Crear tabla para alertas de seguridad
CREATE TABLE IF NOT EXISTS public.security_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('login_attempt', 'data_access', 'permission_change', 'system_event', 'compliance_violation')),
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'investigating', 'resolved', 'false_positive')),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email TEXT,
    ip_address INET,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    alert_data JSONB DEFAULT '{}'::jsonb
);

-- Crear tabla para reportes de compliance
CREATE TABLE IF NOT EXISTS public.compliance_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    period TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generated_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    overall_compliance DECIMAL(5,2) NOT NULL DEFAULT 0,
    total_rules INTEGER NOT NULL DEFAULT 0,
    compliant_rules INTEGER NOT NULL DEFAULT 0,
    violations INTEGER NOT NULL DEFAULT 0,
    recommendations TEXT[],
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'final', 'archived')),
    report_data JSONB DEFAULT '{}'::jsonb
);

-- Crear tabla para violaciones de compliance
CREATE TABLE IF NOT EXISTS public.compliance_violations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rule_id UUID REFERENCES public.compliance_rules(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    violation_type TEXT NOT NULL,
    description TEXT,
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    violation_data JSONB DEFAULT '{}'::jsonb
);

-- Crear tabla para políticas de seguridad
CREATE TABLE IF NOT EXISTS public.security_policies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    policy_type TEXT NOT NULL CHECK (policy_type IN ('password', 'session', 'access_control', 'data_protection', 'audit')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
    policy_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource_type ON public.audit_logs(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON public.audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON public.audit_logs(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON public.audit_logs(ip_address);

CREATE INDEX IF NOT EXISTS idx_compliance_rules_category ON public.compliance_rules(category);
CREATE INDEX IF NOT EXISTS idx_compliance_rules_status ON public.compliance_rules(status);
CREATE INDEX IF NOT EXISTS idx_compliance_rules_severity ON public.compliance_rules(severity);
CREATE INDEX IF NOT EXISTS idx_compliance_rules_next_check ON public.compliance_rules(next_check);

CREATE INDEX IF NOT EXISTS idx_security_alerts_type ON public.security_alerts(type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON public.security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_status ON public.security_alerts(status);
CREATE INDEX IF NOT EXISTS idx_security_alerts_timestamp ON public.security_alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_security_alerts_user_id ON public.security_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_security_alerts_ip_address ON public.security_alerts(ip_address);

CREATE INDEX IF NOT EXISTS idx_compliance_reports_period ON public.compliance_reports(period);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_status ON public.compliance_reports(status);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_generated_at ON public.compliance_reports(generated_at);

CREATE INDEX IF NOT EXISTS idx_compliance_violations_rule_id ON public.compliance_violations(rule_id);
CREATE INDEX IF NOT EXISTS idx_compliance_violations_status ON public.compliance_violations(status);
CREATE INDEX IF NOT EXISTS idx_compliance_violations_detected_at ON public.compliance_violations(detected_at);

CREATE INDEX IF NOT EXISTS idx_security_policies_type ON public.security_policies(policy_type);
CREATE INDEX IF NOT EXISTS idx_security_policies_status ON public.security_policies(status);

-- Triggers para actualizar updated_at
CREATE TRIGGER update_compliance_rules_updated_at 
    BEFORE UPDATE ON public.compliance_rules 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_security_policies_updated_at 
    BEFORE UPDATE ON public.security_policies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_policies ENABLE ROW LEVEL SECURITY;

-- Políticas para logs de auditoría (solo lectura para admins)
CREATE POLICY "Admins can view all audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- Políticas para reglas de compliance
CREATE POLICY "Admins can manage compliance rules" ON public.compliance_rules
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

-- Políticas para alertas de seguridad
CREATE POLICY "Admins can view all security alerts" ON public.security_alerts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "Admins can update security alerts" ON public.security_alerts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

CREATE POLICY "System can insert security alerts" ON public.security_alerts
    FOR INSERT WITH CHECK (true);

-- Políticas para reportes de compliance
CREATE POLICY "Admins can manage compliance reports" ON public.compliance_reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

-- Políticas para violaciones de compliance
CREATE POLICY "Admins can manage compliance violations" ON public.compliance_violations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

-- Políticas para políticas de seguridad
CREATE POLICY "Admins can manage security policies" ON public.security_policies
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

-- Función para registrar logs de auditoría automáticamente
CREATE OR REPLACE FUNCTION log_audit_event(
    p_action TEXT,
    p_resource_type TEXT,
    p_resource_id TEXT,
    p_details JSONB DEFAULT '{}'::jsonb,
    p_severity TEXT DEFAULT 'low',
    p_status TEXT DEFAULT 'success'
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        user_email,
        action,
        resource_type,
        resource_id,
        details,
        ip_address,
        user_agent,
        severity,
        status
    ) VALUES (
        auth.uid(),
        (SELECT email FROM public.profiles WHERE id = auth.uid()),
        p_action,
        p_resource_type,
        p_resource_id,
        p_details,
        inet_client_addr(),
        current_setting('request.headers')::json->>'user-agent',
        p_severity,
        p_status
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para crear alertas de seguridad automáticamente
CREATE OR REPLACE FUNCTION create_security_alert(
    p_type TEXT,
    p_title TEXT,
    p_description TEXT,
    p_severity TEXT DEFAULT 'medium',
    p_user_id UUID DEFAULT NULL,
    p_user_email TEXT DEFAULT NULL,
    p_alert_data JSONB DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.security_alerts (
        type,
        title,
        description,
        severity,
        user_id,
        user_email,
        ip_address,
        alert_data
    ) VALUES (
        p_type,
        p_title,
        p_description,
        p_severity,
        p_user_id,
        p_user_email,
        inet_client_addr(),
        p_alert_data
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar compliance automáticamente
CREATE OR REPLACE FUNCTION check_compliance_rules()
RETURNS void AS $$
DECLARE
    rule_record RECORD;
    violation_count INTEGER;
BEGIN
    FOR rule_record IN 
        SELECT * FROM public.compliance_rules 
        WHERE status = 'active' 
        AND next_check <= NOW()
    LOOP
        -- Aquí se implementarían las verificaciones específicas según el tipo de regla
        -- Por ahora es un placeholder
        
        -- Actualizar próxima verificación
        UPDATE public.compliance_rules 
        SET 
            last_check = NOW(),
            next_check = NOW() + INTERVAL '1 day'
        WHERE id = rule_record.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Triggers para auditoría automática
CREATE OR REPLACE FUNCTION audit_user_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_audit_event(
            'user_created',
            'user',
            NEW.id::TEXT,
            jsonb_build_object('email', NEW.email, 'role', NEW.role),
            'medium'
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.role != NEW.role THEN
            PERFORM log_audit_event(
                'role_changed',
                'user',
                NEW.id::TEXT,
                jsonb_build_object('old_role', OLD.role, 'new_role', NEW.role),
                'high'
            );
            
            PERFORM create_security_alert(
                'permission_change',
                'Cambio de Rol de Usuario',
                'Se cambió el rol del usuario ' || NEW.email || ' de ' || OLD.role || ' a ' || NEW.role,
                'high',
                NEW.id,
                NEW.email
            );
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM log_audit_event(
            'user_deleted',
            'user',
            OLD.id::TEXT,
            jsonb_build_object('email', OLD.email, 'role', OLD.role),
            'high'
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_user_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION audit_user_changes();

-- Trigger para auditoría de cambios en restaurantes
CREATE OR REPLACE FUNCTION audit_restaurant_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        PERFORM log_audit_event(
            'restaurant_created',
            'restaurant',
            NEW.id::TEXT,
            jsonb_build_object('name', NEW.name, 'location', NEW.location),
            'medium'
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        PERFORM log_audit_event(
            'restaurant_updated',
            'restaurant',
            NEW.id::TEXT,
            jsonb_build_object('name', NEW.name, 'location', NEW.location),
            'low'
        );
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        PERFORM log_audit_event(
            'restaurant_deleted',
            'restaurant',
            OLD.id::TEXT,
            jsonb_build_object('name', OLD.name, 'location', OLD.location),
            'high'
        );
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_restaurant_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.restaurants
    FOR EACH ROW
    EXECUTE FUNCTION audit_restaurant_changes(); 