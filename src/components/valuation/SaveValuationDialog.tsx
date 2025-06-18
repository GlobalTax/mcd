
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

interface SaveValuationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  valuationName: string;
  onValuationNameChange: (name: string) => void;
  onSave: () => void;
  currentValuationId: string | null;
}

const SaveValuationDialog = ({
  isOpen,
  onOpenChange,
  valuationName,
  onValuationNameChange,
  onSave,
  currentValuationId
}: SaveValuationDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Guardar Valoración</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nombre de la Valoración
            </label>
            <Input
              value={valuationName}
              onChange={(e) => onValuationNameChange(e.target.value)}
              placeholder="Ej: Valoración Base 2024"
            />
          </div>
          <Button onClick={onSave} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            {currentValuationId ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SaveValuationDialog;
