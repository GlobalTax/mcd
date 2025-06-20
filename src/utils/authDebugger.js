import { supabase } from '@/integrations/supabase/client';

export class AuthDebugger {
  constructor() {
    this.debugLog = [];
  }

  log(message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      data
    };
    this.debugLog.push(logEntry);
    console.log(`[AuthDebugger] ${message}`, data);
  }

  async diagnoseAuthIssues() {
    this.log('Iniciando diagnóstico de problemas de autenticación');
    
    try {
      // 1. Verificar conexión a Supabase
      this.log('1. Verificando conexión a Supabase...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        this.log('❌ Error al obtener sesión:', sessionError);
        return this.generateReport();
      }
      
      this.log('✅ Conexión a Supabase exitosa');
      this.log('Sesión actual:', session ? 'Activa' : 'No hay sesión');
      
      if (session?.user) {
        this.log('Usuario en sesión:', {
          id: session.user.id,
          email: session.user.email,
          email_confirmed: session.user.email_confirmed_at
        });
      }

      // 2. Verificar tabla profiles
      this.log('2. Verificando tabla profiles...');
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (profilesError) {
        this.log('❌ Error al acceder a tabla profiles:', profilesError);
      } else {
        this.log('✅ Tabla profiles accesible');
        this.log('Número de perfiles en la tabla:', profiles?.length || 0);
      }

      // 3. Si hay usuario en sesión, verificar su perfil
      if (session?.user) {
        this.log('3. Verificando perfil del usuario actual...');
        const { data: userProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          this.log('❌ Error al obtener perfil del usuario:', profileError);
          
          // Intentar crear el perfil si no existe
          if (profileError.code === 'PGRST116') {
            this.log('Perfil no encontrado, intentando crear uno...');
            await this.createUserProfile(session.user);
          }
        } else {
          this.log('✅ Perfil del usuario encontrado:', {
            id: userProfile.id,
            email: userProfile.email,
            role: userProfile.role,
            full_name: userProfile.full_name
          });
        }
      }

      // 4. Verificar políticas RLS
      this.log('4. Verificando políticas RLS...');
      await this.checkRLSPolicies();

      // 5. Verificar funciones de trigger
      this.log('5. Verificando funciones de trigger...');
      await this.checkTriggerFunctions();

    } catch (error) {
      this.log('❌ Error general en diagnóstico:', error);
    }

    return this.generateReport();
  }

  async createUserProfile(user) {
    try {
      this.log('Creando perfil para usuario:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email || 'usuario@ejemplo.com',
          full_name: user.user_metadata?.full_name || 'Usuario',
          role: 'franchisee'
        })
        .select()
        .single();

      if (error) {
        this.log('❌ Error al crear perfil:', error);
        return null;
      }

      this.log('✅ Perfil creado exitosamente:', data);
      return data;
    } catch (error) {
      this.log('❌ Error inesperado al crear perfil:', error);
      return null;
    }
  }

  async checkRLSPolicies() {
    try {
      // Verificar si podemos acceder a la tabla profiles con RLS habilitado
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) {
        this.log('❌ Error con políticas RLS en profiles:', error);
      } else {
        this.log('✅ Políticas RLS funcionando correctamente');
      }
    } catch (error) {
      this.log('❌ Error al verificar políticas RLS:', error);
    }
  }

  async checkTriggerFunctions() {
    try {
      // Verificar si la función handle_new_user existe
      const { data, error } = await supabase
        .rpc('handle_new_user', { new: { id: 'test', email: 'test@test.com' } });

      if (error && error.message.includes('function') && error.message.includes('not found')) {
        this.log('⚠️ Función handle_new_user no encontrada - los triggers pueden no funcionar');
      } else {
        this.log('✅ Función handle_new_user disponible');
      }
    } catch (error) {
      this.log('⚠️ No se pudo verificar función handle_new_user:', error.message);
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalChecks: this.debugLog.length,
        errors: this.debugLog.filter(log => log.message.includes('❌')).length,
        warnings: this.debugLog.filter(log => log.message.includes('⚠️')).length,
        successes: this.debugLog.filter(log => log.message.includes('✅')).length
      },
      logs: this.debugLog,
      recommendations: this.generateRecommendations()
    };

    console.log('📋 Reporte de diagnóstico completo:', report);
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    const errorLogs = this.debugLog.filter(log => log.message.includes('❌'));
    const warningLogs = this.debugLog.filter(log => log.message.includes('⚠️'));

    if (errorLogs.length > 0) {
      recommendations.push('🔧 Hay errores que necesitan atención inmediata');
    }

    if (warningLogs.length > 0) {
      recommendations.push('⚠️ Hay advertencias que deberían revisarse');
    }

    // Recomendaciones específicas basadas en los errores encontrados
    const hasProfileErrors = errorLogs.some(log => log.message.includes('profiles'));
    if (hasProfileErrors) {
      recommendations.push('📝 Verificar que la tabla profiles existe y tiene las políticas RLS correctas');
    }

    const hasRLSErrors = errorLogs.some(log => log.message.includes('RLS'));
    if (hasRLSErrors) {
      recommendations.push('🔐 Revisar las políticas de Row Level Security en Supabase');
    }

    const hasTriggerErrors = warningLogs.some(log => log.message.includes('trigger'));
    if (hasTriggerErrors) {
      recommendations.push('⚡ Verificar que los triggers y funciones están correctamente configurados');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ El sistema de autenticación parece estar funcionando correctamente');
    }

    return recommendations;
  }

  // Método para limpiar logs
  clearLogs() {
    this.debugLog = [];
  }

  // Método para obtener logs
  getLogs() {
    return this.debugLog;
  }
}

// Instancia global del debugger
export const authDebugger = new AuthDebugger();

// Función helper para usar en componentes
export const debugAuth = async () => {
  return await authDebugger.diagnoseAuthIssues();
}; 