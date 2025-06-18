
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, FolderOpen } from 'lucide-react';

interface ValuationActionsProps {
  selectedRestaurantId: string;
  onSaveClick: () => void;
  onLoadClick: () => void;
  currentValuationId: string | null;
}

const ValuationActions = ({
  selectedRestaurantId,
  onSaveClick,
  onLoadClick,
  currentValuationId
}: ValuationActionsProps) => {
  if (!selectedRestaurantId) return null;

  return (
    <div className="flex gap-2">
      <Button onClick={onSaveClick} className="flex-1">
        <Save className="w-4 h-4 mr-2" />
        {currentValuationId ? 'Actualizar Valoración' : 'Guardar Valoración'}
      </Button>
      <Button variant="outline" onClick={onLoadClick} className="flex-1">
        <FolderOpen className="w-4 h-4 mr-2" />
        Cargar Valoración
      </Button>
    </div>
  );
};

export default ValuationActions;
