
-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'franchisee' CHECK (role IN ('admin', 'franchisee', 'manager')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear tabla de franquiciados
CREATE TABLE public.franchisees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  franchisee_name TEXT NOT NULL,
  company_name TEXT,
  tax_id TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'España',
  total_restaurants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Crear tabla de restaurantes
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  franchisee_id UUID NOT NULL REFERENCES public.franchisees(id) ON DELETE CASCADE,
  site_number TEXT NOT NULL UNIQUE,
  restaurant_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'España',
  opening_date DATE,
  restaurant_type TEXT DEFAULT 'traditional' CHECK (restaurant_type IN ('traditional', 'mccafe', 'drive_thru', 'express')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'closed')),
  square_meters INTEGER,
  seating_capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS para todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.franchisees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Políticas para franchisees
CREATE POLICY "Users can view own franchisee data"
ON public.franchisees
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update own franchisee data"
ON public.franchisees
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own franchisee data"
ON public.franchisees
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Políticas para restaurants
CREATE POLICY "Franchisees can view their restaurants"
ON public.restaurants
FOR SELECT
USING (
  franchisee_id IN (
    SELECT id FROM public.franchisees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Franchisees can update their restaurants"
ON public.restaurants
FOR UPDATE
USING (
  franchisee_id IN (
    SELECT id FROM public.franchisees WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Franchisees can insert restaurants"
ON public.restaurants
FOR INSERT
WITH CHECK (
  franchisee_id IN (
    SELECT id FROM public.franchisees WHERE user_id = auth.uid()
  )
);

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email)
  );
  RETURN new;
END;
$$;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar timestamp
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_franchisees_updated_at 
  BEFORE UPDATE ON public.franchisees 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at 
  BEFORE UPDATE ON public.restaurants 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Actualizar la tabla profit_loss_data para referenciar restaurants correctamente
ALTER TABLE public.profit_loss_data 
ADD CONSTRAINT fk_profit_loss_restaurant 
FOREIGN KEY (restaurant_id) REFERENCES public.restaurants(site_number);

-- Actualizar las políticas de profit_loss_data
DROP POLICY IF EXISTS "Users can view P&L data for their restaurants" ON public.profit_loss_data;

CREATE POLICY "Franchisees can view P&L data for their restaurants"
ON public.profit_loss_data
FOR SELECT
USING (
  restaurant_id IN (
    SELECT r.site_number 
    FROM public.restaurants r
    JOIN public.franchisees f ON r.franchisee_id = f.id
    WHERE f.user_id = auth.uid()
  )
);

CREATE POLICY "Franchisees can insert P&L data for their restaurants"
ON public.profit_loss_data
FOR INSERT
WITH CHECK (
  restaurant_id IN (
    SELECT r.site_number 
    FROM public.restaurants r
    JOIN public.franchisees f ON r.franchisee_id = f.id
    WHERE f.user_id = auth.uid()
  )
);

CREATE POLICY "Franchisees can update P&L data for their restaurants"
ON public.profit_loss_data
FOR UPDATE
USING (
  restaurant_id IN (
    SELECT r.site_number 
    FROM public.restaurants r
    JOIN public.franchisees f ON r.franchisee_id = f.id
    WHERE f.user_id = auth.uid()
  )
);
