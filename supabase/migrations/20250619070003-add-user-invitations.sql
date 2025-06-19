-- Crear tabla para invitaciones de usuarios
CREATE TABLE IF NOT EXISTS public.user_invitations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('franchisee', 'asesor', 'admin')),
    restaurant_id UUID REFERENCES public.base_restaurants(id) ON DELETE SET NULL,
    message TEXT,
    invited_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_user_invitations_email ON public.user_invitations(email);
CREATE INDEX IF NOT EXISTS idx_user_invitations_status ON public.user_invitations(status);
CREATE INDEX IF NOT EXISTS idx_user_invitations_invited_by ON public.user_invitations(invited_by);
CREATE INDEX IF NOT EXISTS idx_user_invitations_expires_at ON public.user_invitations(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_invitations_created_at ON public.user_invitations(created_at);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_user_invitations_updated_at 
    BEFORE UPDATE ON public.user_invitations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;

-- Política para que los admins vean todas las invitaciones
CREATE POLICY "Admins can view all user invitations" ON public.user_invitations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

-- Política para que los asesores vean las invitaciones de sus franquiciados
CREATE POLICY "Advisors can view their franchisees invitations" ON public.user_invitations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role = 'asesor'
        )
    );

-- Política para que los admins inserten invitaciones
CREATE POLICY "Admins can insert user invitations" ON public.user_invitations
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

-- Política para que los admins actualicen invitaciones
CREATE POLICY "Admins can update user invitations" ON public.user_invitations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

-- Política para que los admins eliminen invitaciones
CREATE POLICY "Admins can delete user invitations" ON public.user_invitations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'superadmin')
        )
    );

-- Función para marcar invitaciones como expiradas automáticamente
CREATE OR REPLACE FUNCTION mark_expired_invitations()
RETURNS void AS $$
BEGIN
    UPDATE public.user_invitations 
    SET status = 'expired' 
    WHERE expires_at < NOW() 
    AND status = 'pending';
END;
$$ LANGUAGE plpgsql;

-- Crear un job para ejecutar la función periódicamente (cada hora)
-- Nota: Esto requiere pg_cron que puede no estar disponible en todos los planes
-- SELECT cron.schedule('mark-expired-invitations', '0 * * * *', 'SELECT mark_expired_invitations();'); 