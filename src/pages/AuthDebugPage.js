import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bug, ArrowLeft, Database, Shield, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AuthDebugPanel from '@/components/AuthDebugPanel';

const AuthDebugPage = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const quickActions = [
    {
      title: 'Verificar Conexión',
      description: 'Comprobar si la conexión a Supabase funciona',
      icon: Database,
      action: () => {
        // Implementar verificación rápida
        console.log('Verificando conexión...');
      }
    },
    {
      title: 'Limpiar Sesión',
      description: 'Cerrar sesión y limpiar datos locales',
      icon: Shield,
      action: handleSignOut
    },
    {
      title: 'Crear Usuario de Prueba',
      description: 'Crear un usuario de prueba para verificar el sistema',
      icon: User,
      action: () => {
        // Implementar creación de usuario de prueba
        console.log('Creando usuario de prueba...');
      }
    },
    {
      title: 'Configuración RLS',
      description: 'Verificar políticas de Row Level Security',
      icon: Settings,
      action: () => {
        // Implementar verificación de RLS
        console.log('Verificando RLS...');
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Bug className="h-6 w-6 text-red-600" />
                Diagnóstico de Autenticación
              </h1>
              <p className="text-gray-600">
                Herramientas para diagnosticar y solucionar problemas de autenticación
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={user ? 'default' : 'secondary'}>
              {user ? 'Autenticado' : 'No autenticado'}
            </Badge>
            {user && (
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Cerrar Sesión
              </Button>
            )}
          </div>
        </div>

        {/* Estado actual */}
        <Card>
          <CardHeader>
            <CardTitle>Estado Actual del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">Usuario</span>
                </div>
                <p className="text-sm text-gray-600">
                  {loading ? 'Cargando...' : user ? user.email : 'No autenticado'}
                </p>
                {user && (
                  <Badge variant="outline" className="mt-2">
                    {user.role}
                  </Badge>
                )}
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">Base de Datos</span>
                </div>
                <p className="text-sm text-gray-600">
                  Supabase
                </p>
                <Badge variant="outline" className="mt-2">
                  Conectado
                </Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="font-semibold">Autenticación</span>
                </div>
                <p className="text-sm text-gray-600">
                  {user ? 'Activa' : 'Inactiva'}
                </p>
                <Badge variant={user ? 'default' : 'secondary'} className="mt-2">
                  {user ? 'Sesión válida' : 'Sin sesión'}
                </Badge>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="h-4 w-4 text-orange-600" />
                  <span className="font-semibold">RLS</span>
                </div>
                <p className="text-sm text-gray-600">
                  Row Level Security
                </p>
                <Badge variant="outline" className="mt-2">
                  Habilitado
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start gap-2"
                  onClick={action.action}
                >
                  <action.icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs text-gray-600">{action.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Información de ayuda */}
        <Alert>
          <Bug className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <strong>Problemas comunes de autenticación:</strong>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Usuario no reconocido:</strong> El perfil no existe en la tabla profiles</li>
                <li><strong>Error de permisos:</strong> Las políticas RLS están bloqueando el acceso</li>
                <li><strong>Sesión expirada:</strong> El token de autenticación ha caducado</li>
                <li><strong>Problemas de red:</strong> No se puede conectar a Supabase</li>
                <li><strong>Triggers fallidos:</strong> La función handle_new_user no se ejecutó</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>

        {/* Panel de diagnóstico principal */}
        <AuthDebugPanel />
      </div>
    </div>
  );
};

export default AuthDebugPage; 