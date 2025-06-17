
-- Verificar si los franquiciados se insertaron correctamente
SELECT COUNT(*) as total_franchisees FROM public.franchisees;

-- Ver algunos franquiciados de ejemplo
SELECT 
  franchisee_name,
  company_name,
  tax_id,
  total_restaurants,
  user_id
FROM public.franchisees 
LIMIT 5;

-- Habilitar RLS en la tabla franchisees si no está habilitado
ALTER TABLE public.franchisees ENABLE ROW LEVEL SECURITY;

-- Crear política para que los advisors puedan ver todos los franquiciados
CREATE POLICY "Advisors can view all franchisees" 
ON public.franchisees 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('advisor', 'admin', 'superadmin')
  )
);

-- Crear política para que los advisors puedan crear franquiciados
CREATE POLICY "Advisors can create franchisees" 
ON public.franchisees 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('advisor', 'admin', 'superadmin')
  )
);

-- Crear política para que los advisors puedan actualizar franquiciados
CREATE POLICY "Advisors can update franchisees" 
ON public.franchisees 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('advisor', 'admin', 'superadmin')
  )
);

-- Crear política para que los advisors puedan eliminar franquiciados
CREATE POLICY "Advisors can delete franchisees" 
ON public.franchisees 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role IN ('advisor', 'admin', 'superadmin')
  )
);
