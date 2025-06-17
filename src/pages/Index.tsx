
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, BarChart3, Shield, Store, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Si está cargando, mostrar un loading simple
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">McDonald's Portal</h1>
                <p className="text-sm text-gray-600">Sistema de Gestión Integral</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Hola, {user.full_name || user.email}</span>
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Ir al Dashboard
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/auth')}
                    className="flex items-center space-x-2"
                  >
                    <Store className="w-4 h-4" />
                    <span>Franquiciados</span>
                  </Button>
                  <Button 
                    onClick={() => navigate('/advisor-auth')}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Asesores</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Sistema de Gestión McDonald's
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plataforma integral para la gestión de franquicias, análisis financiero y 
              administración de restaurantes McDonald's
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Franquiciados Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/auth')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="w-8 h-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Portal de Franquiciados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-center mb-6">
                  Gestiona tu restaurante, analiza tu rendimiento financiero y accede a herramientas de valoración.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">Análisis Profit & Loss</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">Gestión de Restaurantes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-red-500" />
                    <span className="text-gray-700">Valoración de Franquicias</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 mt-6"
                  onClick={() => navigate('/auth')}
                >
                  Acceder como Franquiciado
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Asesores Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/advisor-auth')}>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Portal de Asesores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-center mb-6">
                  Panel administrativo completo para gestionar franquiciados, restaurantes y asignaciones.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Gestión de Franquiciados</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Base de Restaurantes</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <span className="text-gray-700">Reportes y Análisis</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 mt-6"
                  onClick={() => navigate('/advisor-auth')}
                >
                  Acceder como Asesor
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <span className="text-lg font-semibold">McDonald's Portal</span>
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
