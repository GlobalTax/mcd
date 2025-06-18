
import React from 'react';

interface ValuationStatusCardProps {
  selectedRestaurantId: string;
  selectedRestaurantName: string;
  currentValuationId: string | null;
}

const ValuationStatusCard = ({
  selectedRestaurantId,
  selectedRestaurantName,
  currentValuationId
}: ValuationStatusCardProps) => {
  if (!selectedRestaurantId) return null;

  return (
    <div className="p-3 bg-blue-50 rounded-lg">
      <p className="text-blue-800 font-medium">Restaurante Seleccionado:</p>
      <p className="text-blue-700">{selectedRestaurantName}</p>
      {currentValuationId && (
        <p className="text-sm text-blue-600 mt-1">
          Valoración cargada (ID: {currentValuationId.slice(0, 8)}...)
        </p>
      )}
    </div>
  );
};

export default ValuationStatusCard;
