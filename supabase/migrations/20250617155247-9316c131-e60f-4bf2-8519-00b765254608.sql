
-- Identificar franquiciados con nombres duplicados
SELECT 
  franchisee_name,
  COUNT(*) as count,
  STRING_AGG(id::text, ', ') as ids,
  STRING_AGG(company_name, ' | ') as company_names,
  STRING_AGG(tax_id, ' | ') as tax_ids
FROM public.franchisees 
GROUP BY franchisee_name 
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC, franchisee_name;
