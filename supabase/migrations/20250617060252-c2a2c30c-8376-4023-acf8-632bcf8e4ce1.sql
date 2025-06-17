
-- Habilitar RLS en la tabla profit_loss_templates
ALTER TABLE public.profit_loss_templates ENABLE ROW LEVEL SECURITY;

-- Crear política para que todos los usuarios autenticados puedan ver las plantillas
CREATE POLICY "Authenticated users can view templates"
ON public.profit_loss_templates
FOR SELECT
TO authenticated
USING (true);

-- Crear política para que solo administradores puedan insertar plantillas
CREATE POLICY "Admins can insert templates"
ON public.profit_loss_templates
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Crear política para que solo administradores puedan actualizar plantillas
CREATE POLICY "Admins can update templates"
ON public.profit_loss_templates
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Crear política para que solo administradores puedan eliminar plantillas
CREATE POLICY "Admins can delete templates"
ON public.profit_loss_templates
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
