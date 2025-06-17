import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Settings, User, Users, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserManagement from '@/components/UserManagement';

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')} 
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <Settings className="text-white w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Configuración
                  </h1>
                  <p className="text-gray-600 font-medium">
                    Gestiona tu cuenta y configuración del sistema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-gray-200">
              <TabsList className="h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="profile" 
                  className="flex items-center gap-2 px-6 py-4 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600"
                >
                  <User className="w-4 h-4" />
                  Mi Perfil
                </TabsTrigger>
                {user?.role === 'admin' && (
                  <TabsTrigger 
                    value="users" 
                    className="flex items-center gap-2 px-6 py-4 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600"
                  >
                    <Users className="w-4 h-4" />
                    Usuarios
                  </TabsTrigger>
                )}
                <TabsTrigger 
                  value="system" 
                  className="flex items-center gap-2 px-6 py-4 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 data-[state=active]:border-b-2 data-[state=active]:border-red-600"
                >
                  <Building className="w-4 h-4" />
                  Sistema
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Nombre</label>
                        <p className="mt-1 text-gray-900">{user?.full_name || 'No especificado'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-gray-900">{user?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Rol</label>
                        <p className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user?.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user?.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                            user?.role === 'advisor' ? 'bg-purple-100 text-purple-800' :
                            user?.role === 'asistente' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user?.role === 'admin' ? 'Administrador' :
                             user?.role === 'manager' ? 'Gerente' :
                             user?.role === 'advisor' ? 'Asesor' :
                             user?.role === 'asistente' ? 'Asistente' :
                             'Franquiciado'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Teléfono</label>
                        <p className="mt-1 text-gray-900">{user?.phone || 'No especificado'}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={handleSignOut}
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Cerrar Sesión
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {user?.role === 'admin' && (
                <TabsContent value="users" className="mt-0">
                  <UserManagement />
                </TabsContent>
              )}

              <TabsContent value="system" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración del Sistema</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Versión</label>
                          <p className="mt-1 text-gray-900">v1.0.0</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Última actualización</label>
                          <p className="mt-1 text-gray-900">{new Date().toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Portal de gestión de franquiciados McDonald's
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
