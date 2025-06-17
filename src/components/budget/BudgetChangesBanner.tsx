
import React from 'react';

interface BudgetChangesBannerProps {
  hasChanges: boolean;
}

export const BudgetChangesBanner: React.FC<BudgetChangesBannerProps> = ({
  hasChanges
}) => {
  if (!hasChanges) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
      <p className="text-sm text-yellow-800">
        ⚠️ Tienes cambios sin guardar. No olvides hacer clic en "Guardar" para preservar tus modificaciones.
      </p>
    </div>
  );
};
