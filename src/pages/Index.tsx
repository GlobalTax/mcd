
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, BarChart3, Shield, Store, ArrowRight, TrendingUp, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  console.log('Index - Component rendered');
  console.log('Index - User:', user);
  console.log('Index - Loading:', loading);

  useEffect(() => {
    console.log('Index - useEffect triggered');
    console.log('Index - User in effect:', user);
    console.log('Index - Loading in effect:', loading);
    
    if (user && !loading) {
      console.log('Index - User authenticated, redirecting based on role:', user.role);
      
      try {
        // Redirigir usuarios autenticados según su rol
        if (['asesor', 'admin', 'superadmin'].includes(user.role)) {
          console.log('Index - Redirecting asesor/admin/superadmin to /advisor');
          navigate('/advisor', { replace: true });
        } else if (user.role === 'franchisee') {
          console.log('Index - Redirecting franchisee to /dashboard');
          navigate('/dashboard', { replace: true });
        } else {
          console.log('Index - Unknown role, staying on landing page:', user.role);
        }
      } catch (error) {
        console.error('Index - Error during navigation:', error);
      }
    } else if (!loading) {
      console.log('Index - No user found, showing landing page');
    }
  }, [user, loading, navigate]);

  console.log('Index - About to render, loading state:', loading);

  if (loading) {
    console.log('Index - Rendering loading state');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  console.log('Index - Rendering main content');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">McDonald's Portal</h1>
                <p className="text-sm text-gray-500">Sistema de Gestión Integral</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Hola, {user.full_name || user.email}</span>
                  <Button 
                    onClick={() => {
                      console.log('Index - Manual navigation button clicked for user role:', user.role);
                      try {
                        if (['asesor', 'admin', 'superadmin'].includes(user.role)) {
                          console.log('Index - Manual redirect to /advisor');
                          navigate('/advisor');
                        } else {
                          console.log('Index - Manual redirect to /dashboard');
                          navigate('/dashboard');
                        }
                      } catch (error) {
                        console.error('Index - Error in manual navigation:', error);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Ir al Panel
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/auth')}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Store className="w-4 h-4 mr-2" />
                    Franquiciados
                  </Button>
                  <Button 
                    onClick={() => navigate('/advisor-auth')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Asesores
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Sistema de Gestión McDonald's
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Plataforma integral para la gestión de franquicias, análisis financiero y 
            administración de restaurantes McDonald's
          </p>
        </div>

        {/* Debug Info - Solo visible si hay usuario */}
        {user && (
          <div className="mb-8 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">Debug Info:</h3>
            <p className="text-sm text-yellow-700">Usuario: {user.email}</p>
            <p className="text-sm text-yellow-700">Rol: {user.role}</p>
            <p className="text-sm text-yellow-700">Loading: {loading ? 'true' : 'false'}</p>
            <Button 
              onClick={() => {
                console.log('Index - Force redirect clicked');
                navigate('/dashboard', { replace: true });
              }}
              className="mt-2 text-xs"
              size="sm"
            >
              Forzar redirección al Dashboard
            </Button>
          </div>
        )}

        {/* Main Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Franquiciados Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white cursor-pointer" onClick={() => navigate('/auth')}>
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <Store className="w-7 h-7 text-red-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
              </div>
              <CardTitle className="text-2xl text-gray-900 mt-4">Portal de Franquiciados</CardTitle>
              <p className="text-gray-600 text-base">
                Gestiona tu restaurante, analiza tu rendimiento financiero y accede a herramientas de valoración.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Análisis Profit & Loss detallado</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Gestión completa de restaurantes</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Valoración profesional de franquicias</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asesores Card */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white cursor-pointer" onClick={() => navigate('/advisor-auth')}>
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Shield className="w-7 h-7 text-blue-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <CardTitle className="text-2xl text-gray-900 mt-4">Portal de Asesores</CardTitle>
              <p className="text-gray-600 text-base">
                Panel administrativo completo para gestionar franquiciados, restaurantes y asignaciones.
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Gestión avanzada de franquiciados</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Base de datos de restaurantes</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Reportes y análisis detallados</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis Financiero</h3>
            <p className="text-gray-600">Herramientas avanzadas para análisis de rentabilidad y proyecciones financieras</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Valoración Profesional</h3>
            <p className="text-gray-600">Sistema de valoración DCF profesional para franquicias McDonald's</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Building className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión Integral</h3>
            <p className="text-gray-600">Administración completa de restaurantes y asignaciones</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="text-xl font-semibold">McDonald's Portal</span>
          </div>
          <p className="text-gray-400">
            Sistema de gestión integral para franquicias McDonald's
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
