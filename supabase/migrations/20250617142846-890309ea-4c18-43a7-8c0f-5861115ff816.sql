
-- Insertar algunos franquiciados de ejemplo para que puedas probar la funcionalidad
WITH advisor_user AS (
  SELECT id FROM public.profiles WHERE role IN ('advisor', 'admin', 'superadmin') LIMIT 1
)
INSERT INTO public.franchisees (
  user_id,
  franchisee_name,
  company_name,
  tax_id,
  address,
  city,
  state,
  postal_code,
  total_restaurants
)
SELECT 
  au.id,
  franchisee_data.franchisee_name,
  franchisee_data.company_name,
  franchisee_data.tax_id,
  franchisee_data.address,
  franchisee_data.city,
  franchisee_data.state,
  franchisee_data.postal_code,
  franchisee_data.total_restaurants
FROM advisor_user au
CROSS JOIN (
  VALUES 
    ('Franquicia Madrid Centro', 'Restaurantes Madrid Centro S.L.', 'B12345678', 'Calle Gran Vía 123', 'Madrid', 'Madrid', '28001', 3),
    ('Grupo Barcelona Este', 'Barcelona Fast Food S.A.', 'A87654321', 'Av. Diagonal 456', 'Barcelona', 'Barcelona', '08001', 2),
    ('Franquicia Valencia Sur', 'Valencia Restauración S.L.', 'B23456789', 'Calle Xàtiva 789', 'Valencia', 'Valencia', '46001', 1),
    ('Sevilla Gourmet', 'Andalucía Food Group S.L.', 'B34567890', 'Calle Sierpes 321', 'Sevilla', 'Sevilla', '41001', 2),
    ('Franquicia Bilbao Norte', 'Euskadi Restaurants S.A.', 'A45678901', 'Gran Vía 654', 'Bilbao', 'Vizcaya', '48001', 1)
) AS franchisee_data(franchisee_name, company_name, tax_id, address, city, state, postal_code, total_restaurants);
