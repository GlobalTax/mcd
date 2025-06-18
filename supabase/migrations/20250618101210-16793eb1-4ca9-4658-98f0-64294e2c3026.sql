
-- Tabla para invitaciones enviadas a franquiciados
CREATE TABLE public.franchisee_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchisee_id UUID NOT NULL REFERENCES public.franchisees(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  invitation_token UUID NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days')
);

-- Tabla para el historial de acceso de los franquiciados
CREATE TABLE public.franchisee_access_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchisee_id UUID NOT NULL REFERENCES public.franchisees(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  login_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  logout_time TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT,
  session_duration INTEGER -- duración en minutos
);

-- Tabla para el historial de actividad/uso de la plataforma
CREATE TABLE public.franchisee_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchisee_id UUID NOT NULL REFERENCES public.franchisees(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  activity_type TEXT NOT NULL, -- 'valuation_created', 'valuation_viewed', 'restaurant_viewed', etc.
  activity_description TEXT,
  entity_type TEXT, -- 'restaurant', 'valuation', 'report', etc.
  entity_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_franchisee_invitations_franchisee_id ON public.franchisee_invitations(franchisee_id);
CREATE INDEX idx_franchisee_invitations_status ON public.franchisee_invitations(status);
CREATE INDEX idx_franchisee_access_log_franchisee_id ON public.franchisee_access_log(franchisee_id);
CREATE INDEX idx_franchisee_access_log_login_time ON public.franchisee_access_log(login_time);
CREATE INDEX idx_franchisee_activity_log_franchisee_id ON public.franchisee_activity_log(franchisee_id);
CREATE INDEX idx_franchisee_activity_log_created_at ON public.franchisee_activity_log(created_at);

-- Habilitar RLS
ALTER TABLE public.franchisee_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchisee_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchisee_activity_log ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para franchisee_invitations
CREATE POLICY "Advisors can manage all invitations" ON public.franchisee_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('advisor', 'admin', 'superadmin')
    )
  );

CREATE POLICY "Franchisees can view their own invitations" ON public.franchisee_invitations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.franchisees f
      JOIN public.profiles p ON f.user_id = p.id
      WHERE f.id = franchisee_id 
      AND p.id = auth.uid()
    )
  );

-- Políticas RLS para franchisee_access_log
CREATE POLICY "Advisors can view all access logs" ON public.franchisee_access_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('advisor', 'admin', 'superadmin')
    )
  );

CREATE POLICY "System can insert access logs" ON public.franchisee_access_log
  FOR INSERT WITH CHECK (true);

-- Políticas RLS para franchisee_activity_log
CREATE POLICY "Advisors can view all activity logs" ON public.franchisee_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role IN ('advisor', 'admin', 'superadmin')
    )
  );

CREATE POLICY "System can insert activity logs" ON public.franchisee_activity_log
  FOR INSERT WITH CHECK (true);

-- Función para actualizar el último acceso del franquiciado
CREATE OR REPLACE FUNCTION public.update_franchisee_last_access()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar el logout_time de la sesión anterior si existe
  UPDATE public.franchisee_access_log 
  SET logout_time = now(),
      session_duration = EXTRACT(EPOCH FROM (now() - login_time)) / 60
  WHERE user_id = NEW.user_id 
    AND logout_time IS NULL 
    AND id != NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar el último acceso
CREATE TRIGGER trigger_update_franchisee_last_access
  AFTER INSERT ON public.franchisee_access_log
  FOR EACH ROW
  EXECUTE FUNCTION public.update_franchisee_last_access();
