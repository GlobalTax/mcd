
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, LogOut } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string | undefined;
  onNavigateToSettings: () => void;
  onSignOut: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName,
  onNavigateToSettings,
  onSignOut
}) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Bienvenido, {userName}
              </h1>
              <p className="text-sm text-gray-500">
                Portal de Franquiciados McDonald's
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onNavigateToSettings}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configuración
            </Button>
            <Button
              variant="outline"
              onClick={onSignOut}
              className="border-red-100 text-red-600 hover:bg-red-50 shadow-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
