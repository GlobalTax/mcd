
-- Añadir las columnas faltantes a la tabla base_restaurants
ALTER TABLE public.base_restaurants 
ADD COLUMN property_type TEXT,
ADD COLUMN autonomous_community TEXT,
ADD COLUMN franchisee_name TEXT,
ADD COLUMN franchisee_email TEXT,
ADD COLUMN company_tax_id TEXT;
