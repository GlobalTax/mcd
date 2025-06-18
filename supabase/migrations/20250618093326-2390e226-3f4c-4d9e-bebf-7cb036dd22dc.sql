
-- Función para vincular automáticamente restaurantes cuando se crea un franquiciado
CREATE OR REPLACE FUNCTION public.auto_assign_restaurants_to_franchisee()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insertar automáticamente en franchisee_restaurants todos los restaurantes
  -- que tengan el mismo nombre de franquiciado
  INSERT INTO public.franchisee_restaurants (
    franchisee_id,
    base_restaurant_id,
    status,
    assigned_at
  )
  SELECT 
    NEW.id,
    br.id,
    'active',
    now()
  FROM public.base_restaurants br
  WHERE br.franchisee_name = NEW.franchisee_name
  AND NOT EXISTS (
    -- Evitar duplicados si ya existe la asignación
    SELECT 1 FROM public.franchisee_restaurants fr
    WHERE fr.franchisee_id = NEW.id AND fr.base_restaurant_id = br.id
  );
  
  RETURN NEW;
END;
$$;

-- Crear trigger que se ejecute después de insertar un nuevo franquiciado
CREATE TRIGGER auto_assign_restaurants_after_franchisee_insert
  AFTER INSERT ON public.franchisees
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_restaurants_to_franchisee();

-- También crear una función manual para vincular restaurantes existentes
CREATE OR REPLACE FUNCTION public.manually_assign_restaurants_to_existing_franchisees()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  franchisee_record RECORD;
BEGIN
  -- Para cada franquiciado existente, vincular sus restaurantes
  FOR franchisee_record IN 
    SELECT id, franchisee_name FROM public.franchisees
  LOOP
    INSERT INTO public.franchisee_restaurants (
      franchisee_id,
      base_restaurant_id,
      status,
      assigned_at
    )
    SELECT 
      franchisee_record.id,
      br.id,
      'active',
      now()
    FROM public.base_restaurants br
    WHERE br.franchisee_name = franchisee_record.franchisee_name
    AND NOT EXISTS (
      -- Evitar duplicados
      SELECT 1 FROM public.franchisee_restaurants fr
      WHERE fr.franchisee_id = franchisee_record.id AND fr.base_restaurant_id = br.id
    );
  END LOOP;
END;
$$;

-- Ejecutar la función para vincular restaurantes a franquiciados existentes
SELECT public.manually_assign_restaurants_to_existing_franchisees();
