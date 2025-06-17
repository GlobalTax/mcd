
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle, Users, Merge } from 'lucide-react';
import { useDuplicateFranchisees } from '@/hooks/useDuplicateFranchisees';
import { Franchisee } from '@/types/auth';
import { toast } from 'sonner';

export const DuplicateFranchiseesManager: React.FC = () => {
  const { duplicateGroups, loading, error, merging, mergeDuplicates, refreshData } = useDuplicateFranchisees();
  const [selectedPrimary, setSelectedPrimary] = useState<{ [key: string]: string }>({});

  const handleMergeGroup = async (groupKey: string, franchisees: Franchisee[]) => {
    const primaryId = selectedPrimary[groupKey];
    
    if (!primaryId) {
      toast.error('Selecciona el franquiciado principal primero');
      return;
    }

    const primaryFranchisee = franchisees.find(f => f.id === primaryId);
    const duplicatesToMerge = franchisees.filter(f => f.id !== primaryId);

    if (!primaryFranchisee) {
      toast.error('No se encontró el franquiciado principal');
      return;
    }

    const success = await mergeDuplicates(primaryFranchisee, duplicatesToMerge);
    
    if (success) {
      // Remover la selección después de la fusión exitosa
      setSelectedPrimary(prev => {
        const updated = { ...prev };
        delete updated[groupKey];
        return updated;
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analizando duplicados...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          Error al analizar duplicados: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (duplicateGroups.length === 0) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          ¡Perfecto! No se encontraron franquiciados duplicados.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          Se encontraron {duplicateGroups.length} grupos de franquiciados duplicados. 
          Revisa y fusiona los duplicados seleccionando el franquiciado principal.
        </AlertDescription>
      </Alert>

      {duplicateGroups.map((group) => (
        <Card key={group.key} className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-red-600" />
                <span>Grupo Duplicado</span>
                <Badge variant="destructive">{group.count} franquiciados</Badge>
              </div>
              <Button
                onClick={() => handleMergeGroup(group.key, group.franchisees)}
                disabled={!selectedPrimary[group.key] || merging}
                className="bg-red-600 hover:bg-red-700"
                size="sm"
              >
                {merging ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fusionando...
                  </>
                ) : (
                  <>
                    <Merge className="w-4 h-4 mr-2" />
                    Fusionar
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-3">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Razones del duplicado:</h4>
              <div className="flex flex-wrap gap-1">
                {group.reasons.map((reason, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {group.franchisees.map((franchisee) => (
                <div
                  key={franchisee.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPrimary[group.key] === franchisee.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPrimary(prev => ({
                    ...prev,
                    [group.key]: franchisee.id
                  }))}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{franchisee.franchisee_name}</div>
                      <div className="text-sm text-gray-600">
                        {franchisee.company_name && (
                          <span>Empresa: {franchisee.company_name} • </span>
                        )}
                        {franchisee.tax_id && (
                          <span>CIF: {franchisee.tax_id} • </span>
                        )}
                        {franchisee.city && (
                          <span>Ciudad: {franchisee.city} • </span>
                        )}
                        <span>Restaurantes: {franchisee.total_restaurants || 0}</span>
                      </div>
                      {franchisee.profiles?.email && (
                        <div className="text-sm text-gray-500">
                          Email: {franchisee.profiles.email}
                        </div>
                      )}
                    </div>
                    {selectedPrimary[group.key] === franchisee.id && (
                      <Badge className="bg-green-100 text-green-800">
                        Principal
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-500 mt-2">
              Selecciona el franquiciado que quieres mantener como principal. 
              Los demás se fusionarán con este y se eliminarán.
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center">
        <Button
          onClick={refreshData}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Actualizar Análisis
        </Button>
      </div>
    </div>
  );
};
