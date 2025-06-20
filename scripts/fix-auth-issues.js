const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const SUPABASE_URL = "https://ckvqfrppnfhoadcpqhld.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "tu-service-role-key-aqui";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function fixAuthIssues() {
  console.log('🔧 Iniciando reparación de problemas de autenticación...\n');

  try {
    // 1. Verificar conexión
    console.log('1. Verificando conexión a Supabase...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error de conexión:', sessionError);
      return;
    }
    console.log('✅ Conexión exitosa\n');

    // 2. Verificar tabla profiles
    console.log('2. Verificando tabla profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('❌ Error al acceder a profiles:', profilesError);
      console.log('🔧 Intentando crear tabla profiles...');
      await createProfilesTable();
    } else {
      console.log('✅ Tabla profiles existe');
      console.log(`📊 Número de perfiles: ${profiles?.length || 0}\n`);
    }

    // 3. Verificar usuarios sin perfil
    console.log('3. Verificando usuarios sin perfil...');
    await checkAndCreateMissingProfiles();

    // 4. Verificar políticas RLS
    console.log('4. Verificando políticas RLS...');
    await checkAndFixRLSPolicies();

    // 5. Verificar triggers
    console.log('5. Verificando triggers...');
    await checkAndFixTriggers();

    console.log('✅ Reparación completada exitosamente!');

  } catch (error) {
    console.error('❌ Error durante la reparación:', error);
  }
}

async function createProfilesTable() {
  try {
    // Crear tabla profiles
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
          email TEXT NOT NULL,
          full_name TEXT,
          role TEXT NOT NULL DEFAULT 'franchisee' CHECK (role IN ('admin', 'franchisee', 'manager', 'asesor', 'asistente', 'superadmin')),
          phone TEXT,
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
        );

        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Users can view own profile"
        ON public.profiles
        FOR SELECT
        USING (auth.uid() = id);

        CREATE POLICY "Users can update own profile"
        ON public.profiles
        FOR UPDATE
        USING (auth.uid() = id);
      `
    });

    if (error) {
      console.error('❌ Error creando tabla profiles:', error);
    } else {
      console.log('✅ Tabla profiles creada exitosamente');
    }
  } catch (error) {
    console.error('❌ Error inesperado creando tabla:', error);
  }
}

async function checkAndCreateMissingProfiles() {
  try {
    // Obtener todos los usuarios de auth
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError);
      return;
    }

    console.log(`📊 Total de usuarios en auth: ${users.length}`);

    // Verificar cuáles no tienen perfil
    for (const user of users) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        console.log(`🔧 Creando perfil para usuario: ${user.email}`);
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || 'usuario@ejemplo.com',
            full_name: user.user_metadata?.full_name || 'Usuario',
            role: 'franchisee'
          });

        if (insertError) {
          console.error(`❌ Error creando perfil para ${user.email}:`, insertError);
        } else {
          console.log(`✅ Perfil creado para ${user.email}`);
        }
      }
    }

    console.log('✅ Verificación de perfiles completada\n');
  } catch (error) {
    console.error('❌ Error verificando perfiles:', error);
  }
}

async function checkAndFixRLSPolicies() {
  try {
    // Verificar si las políticas existen
    const { data: policies, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error && error.message.includes('policy')) {
      console.log('🔧 Reparando políticas RLS...');
      
      // Crear políticas básicas
      await supabase.rpc('exec_sql', {
        sql: `
          DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
          DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
          
          CREATE POLICY "Users can view own profile"
          ON public.profiles
          FOR SELECT
          USING (auth.uid() = id);

          CREATE POLICY "Users can update own profile"
          ON public.profiles
          FOR UPDATE
          USING (auth.uid() = id);
        `
      });
      
      console.log('✅ Políticas RLS reparadas');
    } else {
      console.log('✅ Políticas RLS funcionando correctamente');
    }
  } catch (error) {
    console.error('❌ Error verificando políticas RLS:', error);
  }
}

async function checkAndFixTriggers() {
  try {
    // Verificar si la función handle_new_user existe
    const { error } = await supabase.rpc('handle_new_user', { 
      new: { id: 'test', email: 'test@test.com' } 
    });

    if (error && error.message.includes('function') && error.message.includes('not found')) {
      console.log('🔧 Creando función handle_new_user...');
      
      await supabase.rpc('exec_sql', {
        sql: `
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

          DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
          
          CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        `
      });
      
      console.log('✅ Función handle_new_user creada');
    } else {
      console.log('✅ Función handle_new_user existe');
    }
  } catch (error) {
    console.error('❌ Error verificando triggers:', error);
  }
}

// Función para crear un usuario de prueba
async function createTestUser() {
  try {
    console.log('🧪 Creando usuario de prueba...');
    
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';

    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true,
      user_metadata: {
        full_name: 'Usuario de Prueba'
      }
    });

    if (error) {
      console.error('❌ Error creando usuario de prueba:', error);
      return;
    }

    console.log('✅ Usuario de prueba creado:');
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${testPassword}`);
    console.log(`   ID: ${data.user.id}`);

    return data.user;
  } catch (error) {
    console.error('❌ Error inesperado creando usuario de prueba:', error);
  }
}

// Función para limpiar datos de prueba
async function cleanupTestData() {
  try {
    console.log('🧹 Limpiando datos de prueba...');
    
    // Eliminar usuarios de prueba
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('❌ Error obteniendo usuarios:', usersError);
      return;
    }

    const testUsers = users.filter(user => 
      user.email.includes('test-') || 
      user.email.includes('@example.com')
    );

    for (const user of testUsers) {
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) {
        console.error(`❌ Error eliminando usuario ${user.email}:`, error);
      } else {
        console.log(`✅ Usuario eliminado: ${user.email}`);
      }
    }

    console.log('✅ Limpieza completada');
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
  }
}

// Exportar funciones
module.exports = {
  fixAuthIssues,
  createTestUser,
  cleanupTestData
};

// Ejecutar si se llama directamente
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'fix':
      fixAuthIssues();
      break;
    case 'test-user':
      createTestUser();
      break;
    case 'cleanup':
      cleanupTestData();
      break;
    default:
      console.log('Uso: node fix-auth-issues.js [fix|test-user|cleanup]');
      console.log('  fix: Reparar problemas de autenticación');
      console.log('  test-user: Crear usuario de prueba');
      console.log('  cleanup: Limpiar datos de prueba');
  }
} 