# 🔧 Guía de Solución de Problemas de Autenticación

## 🚨 Problema: "No me reconoce los usuarios"

Si tienes problemas con el reconocimiento de usuarios en tu aplicación, sigue esta guía paso a paso para diagnosticar y solucionar el problema.

## 📋 Diagnóstico Rápido

### 1. Acceder al Panel de Diagnóstico

Ve a la URL: `http://localhost:3000/auth-debug`

Este panel te permitirá:
- ✅ Ver el estado actual del usuario
- ✅ Ejecutar diagnósticos automáticos
- ✅ Identificar problemas específicos
- ✅ Obtener recomendaciones de solución

### 2. Verificar el Estado Actual

El panel mostrará:
- **Estado de Usuario**: Autenticado/No autenticado
- **ID de Usuario**: El ID único del usuario
- **Rol**: El rol asignado al usuario
- **Conexión a Base de Datos**: Estado de Supabase
- **Políticas RLS**: Estado de Row Level Security

## 🔍 Problemas Comunes y Soluciones

### Problema 1: Usuario no reconocido después del login

**Síntomas:**
- El usuario puede hacer login pero no se reconoce en la aplicación
- Aparece como "No autenticado" aunque haya iniciado sesión
- No se cargan los datos del usuario

**Causas posibles:**
1. **Perfil no existe en la tabla `profiles`**
2. **Políticas RLS bloqueando el acceso**
3. **Trigger `handle_new_user` no funcionó**
4. **Problemas de conexión con Supabase**

**Soluciones:**

#### Solución A: Usar el Script de Reparación

```bash
# Ejecutar el script de reparación automática
node scripts/fix-auth-issues.js fix
```

#### Solución B: Crear Perfil Manualmente

Si el script no funciona, crea el perfil manualmente:

```sql
-- En Supabase SQL Editor
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
  'ID_DEL_USUARIO_AQUI',
  'email@ejemplo.com',
  'Nombre del Usuario',
  'franchisee'
);
```

#### Solución C: Verificar y Reparar Triggers

```sql
-- Verificar si la función existe
SELECT * FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Crear la función si no existe
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

-- Crear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Problema 2: Error de políticas RLS

**Síntomas:**
- Error "new row violates row-level security policy"
- No se pueden crear o leer perfiles
- Acceso denegado a datos

**Solución:**

```sql
-- Verificar políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Eliminar políticas problemáticas
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Crear políticas correctas
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Política para insertar (solo para triggers)
CREATE POLICY "Enable insert for authenticated users only"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);
```

### Problema 3: Tabla profiles no existe

**Síntomas:**
- Error "relation 'profiles' does not exist"
- No se puede acceder a la tabla

**Solución:**

```sql
-- Crear tabla profiles
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'franchisee' CHECK (role IN ('admin', 'franchisee', 'manager', 'asesor', 'asistente', 'superadmin')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Crear políticas
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);
```

## 🛠️ Herramientas de Diagnóstico

### 1. Panel de Diagnóstico Web

Accede a `/auth-debug` para usar la interfaz gráfica de diagnóstico.

### 2. Script de Reparación Automática

```bash
# Reparar problemas de autenticación
node scripts/fix-auth-issues.js fix

# Crear usuario de prueba
node scripts/fix-auth-issues.js test-user

# Limpiar datos de prueba
node scripts/fix-auth-issues.js cleanup
```

### 3. Verificación Manual en Supabase

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Ejecuta estas consultas:

```sql
-- Verificar usuarios en auth
SELECT id, email, created_at FROM auth.users;

-- Verificar perfiles
SELECT * FROM public.profiles;

-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Verificar funciones
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' AND routine_name LIKE '%user%';
```

## 🔧 Configuración de Variables de Entorno

Asegúrate de que tienes las variables correctas en tu `.env`:

```env
VITE_SUPABASE_URL=https://ckvqfrppnfhoadcpqhld.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

## 📞 Pasos de Emergencia

Si nada funciona, sigue estos pasos:

1. **Limpiar caché del navegador**
2. **Cerrar sesión y volver a iniciar**
3. **Verificar conexión a internet**
4. **Revisar consola del navegador para errores**
5. **Contactar soporte técnico**

## 🎯 Verificación Final

Después de aplicar las soluciones:

1. ✅ El usuario puede hacer login
2. ✅ Se muestra el nombre y rol correcto
3. ✅ Se cargan los datos del usuario
4. ✅ No hay errores en la consola
5. ✅ El panel de diagnóstico muestra todo verde

## 📚 Recursos Adicionales

- [Documentación de Supabase Auth](https://supabase.com/docs/guides/auth)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Troubleshooting de Supabase](https://supabase.com/docs/guides/troubleshooting)

---

**¿Necesitas ayuda adicional?** Usa el panel de diagnóstico en `/auth-debug` o revisa los logs en la consola del navegador. 