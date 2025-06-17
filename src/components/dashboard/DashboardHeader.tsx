
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, LogOut, User } from 'lucide-react';

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
    <header className="bg-white border-b border-gray-200/60 sticky top-0 z-50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Portal McDonald's
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{userName}</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToSettings}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 h-9 w-9 p-0"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="text-gray-600 hover:text-red-600 hover:bg-red-50 h-9 w-9 p-0"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
