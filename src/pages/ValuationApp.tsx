
import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Franchisee, Restaurant, RestaurantValuation } from '@/types/restaurant';
import { FranchiseeSelector } from '@/components/FranchiseeSelector';
import { RestaurantManager } from '@/components/RestaurantManager';
import { ValuationForm } from '@/components/ValuationForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ValuationApp() {
  const [franchisees, setFranchisees] = useLocalStorage<Franchisee[]>('franchisees', []);
  const [selectedFranchisee, setSelectedFranchisee] = useState<Franchisee | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [currentView, setCurrentView] = useState<'franchisees' | 'restaurants' | 'valuation'>('franchisees');

  const handleAddFranchisee = (newFranchiseeData: Omit<Franchisee, 'id' | 'createdAt' | 'restaurants'>) => {
    const newFranchisee: Franchisee = {
      ...newFranchiseeData,
      id: Date.now().toString(),
      restaurants: [],
      createdAt: new Date()
    };
    setFranchisees(prev => [...prev, newFranchisee]);
  };

  const handleSelectFranchisee = (franchisee: Franchisee) => {
    setSelectedFranchisee(franchisee);
    setCurrentView('restaurants');
  };

  const handleAddRestaurant = (newRestaurantData: Omit<Restaurant, 'id' | 'createdAt' | 'currentValuation' | 'valuationHistory'>) => {
    const newRestaurant: Restaurant = {
      ...newRestaurantData,
      id: Date.now().toString(),
      valuationHistory: [],
      createdAt: new Date()
    };

    setFranchisees(prev => prev.map(f => 
      f.id === newRestaurantData.franchiseeId 
        ? { ...f, restaurants: [...f.restaurants, newRestaurant] }
        : f
    ));

    // Actualizar el franquiciado seleccionado
    if (selectedFranchisee?.id === newRestaurantData.franchiseeId) {
      setSelectedFranchisee(prev => prev ? {
        ...prev,
        restaurants: [...prev.restaurants, newRestaurant]
      } : null);
    }
  };

  const handleSelectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setCurrentView('valuation');
  };

  const handleSaveValuation = (valuation: RestaurantValuation) => {
    setFranchisees(prev => prev.map(f => ({
      ...f,
      restaurants: f.restaurants.map(r => 
        r.id === valuation.restaurantId 
          ? {
              ...r,
              currentValuation: valuation,
              valuationHistory: [...r.valuationHistory, valuation]
            }
          : r
      )
    })));

    // Actualizar estados locales
    if (selectedFranchisee && selectedRestaurant) {
      const updatedRestaurant = {
        ...selectedRestaurant,
        currentValuation: valuation,
        valuationHistory: [...selectedRestaurant.valuationHistory, valuation]
      };
      
      setSelectedRestaurant(updatedRestaurant);
      setSelectedFranchisee(prev => prev ? {
        ...prev,
        restaurants: prev.restaurants.map(r => r.id === valuation.restaurantId ? updatedRestaurant : r)
      } : null);
    }

    alert('Valoración guardada exitosamente!');
  };

  const handleBack = () => {
    if (currentView === 'valuation') {
      setCurrentView('restaurants');
      setSelectedRestaurant(null);
    } else if (currentView === 'restaurants') {
      setCurrentView('franchisees');
      setSelectedFranchisee(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header moderno */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            {currentView !== 'franchisees' && (
              <Button 
                variant="ghost" 
                onClick={handleBack} 
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    McDonald's Valuation
                  </h1>
                  <p className="text-gray-600 font-medium">
                    Professional Restaurant Valuation Tool
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Breadcrumb moderno */}
          <div className="flex items-center text-sm text-gray-500 bg-white px-4 py-3 rounded-lg border border-gray-200">
            <span className="text-gray-700 font-medium">Franquiciados</span>
            {selectedFranchisee && (
              <>
                <span className="mx-3 text-gray-300">/</span>
                <span className="text-gray-700 font-medium">{selectedFranchisee.name}</span>
              </>
            )}
            {selectedRestaurant && (
              <>
                <span className="mx-3 text-gray-300">/</span>
                <span className="text-red-600 font-medium">{selectedRestaurant.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Content con fondo blanco */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {currentView === 'franchisees' && (
            <FranchiseeSelector
              franchisees={franchisees}
              selectedFranchisee={selectedFranchisee}
              onSelectFranchisee={handleSelectFranchisee}
              onAddFranchisee={handleAddFranchisee}
            />
          )}

          {currentView === 'restaurants' && selectedFranchisee && (
            <RestaurantManager
              franchisee={selectedFranchisee}
              onAddRestaurant={handleAddRestaurant}
              onSelectRestaurant={handleSelectRestaurant}
              selectedRestaurant={selectedRestaurant}
            />
          )}

          {currentView === 'valuation' && selectedRestaurant && (
            <ValuationForm
              restaurant={selectedRestaurant}
              onSaveValuation={handleSaveValuation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
