
-- Primero, crea el usuario en la tabla auth.users (esto normalmente se hace a través del signup)
-- Luego, actualiza el perfil para que tenga el rol de asesor

-- Assuming you have a user already created, update their role to 'asesor'
-- Replace 'user-email@example.com' with the actual email
UPDATE public.profiles 
SET role = 'asesor' 
WHERE email = 'user-email@example.com';

-- Or if you want to create a test user profile directly (after they sign up)
-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES ('your-user-id-here', 'asesor@test.com', 'Asesor Test', 'asesor');
