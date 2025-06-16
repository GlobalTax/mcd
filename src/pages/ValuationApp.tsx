
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {currentView !== 'franchisees' && (
              <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Sistema de Valoración McDonald's
              </h1>
              <p className="text-lg text-gray-600">
                Herramienta profesional para valoración de restaurantes
              </p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500">
            <span>Franquiciados</span>
            {selectedFranchisee && (
              <>
                <span className="mx-2">→</span>
                <span>{selectedFranchisee.name}</span>
              </>
            )}
            {selectedRestaurant && (
              <>
                <span className="mx-2">→</span>
                <span>{selectedRestaurant.name}</span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
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
  );
}
