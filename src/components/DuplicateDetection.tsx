
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, AlertTriangle, Merge, Trash2 } from 'lucide-react';
import { useDuplicateFranchisees } from '@/hooks/useDuplicateFranchisees';
import { toast } from 'sonner';

export const DuplicateDetection: React.FC = () => {
  const { duplicates, loading, findDuplicates, mergeFranchisees } = useDuplicateFranchisees();

  React.useEffect(() => {
    findDuplicates();
  }, []);

  const handleMerge = async (keepId: string, removeIds: string[]) => {
    if (!confirm(`¿Estás seguro de que quieres fusionar estos franquiciados? Esta acción no se puede deshacer.`)) {
      return;
    }

    const success = await mergeFranchisees(keepId, removeIds);
    if (success) {
      toast.success('Franquiciados fusionados correctamente');
    } else {
      toast.error('Error al fusionar franquiciados');
    }
  };

  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'name': return 'Nombre';
      case 'tax_id': return 'CIF/NIF';
      case 'email': return 'Email';
      default: return field;
    }
  };

  const getBadgeColor = (field: string) => {
    switch (field) {
      case 'name': return 'bg-blue-100 text-blue-800';
      case 'tax_id': return 'bg-red-100 text-red-800';
      case 'email': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Analizando duplicados...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Detección de Duplicados</h3>
        <Button onClick={findDuplicates} variant="outline" size="sm">
          Buscar Duplicados
        </Button>
      </div>

      {duplicates.length === 0 ? (
        <Alert>
          <Users className="w-4 h-4" />
          <AlertDescription>
            No se encontraron franquiciados duplicados. ¡Excelente!
          </AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          <Alert>
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              Se encontraron {duplicates.length} grupos de posibles duplicados. 
              Revisa cada grupo antes de fusionar.
            </AlertDescription>
          </Alert>

          {duplicates.map((duplicate, index) => (
            <Card key={index} className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Badge className={getBadgeColor(duplicate.field)}>
                    {getFieldLabel(duplicate.field)}
                  </Badge>
                  <span className="font-normal">
                    {duplicate.value}
                    {duplicate.similarity && (
                      <span className="text-sm text-gray-500 ml-2">
                        (similitud: {Math.round(duplicate.similarity * 100)}%)
                      </span>
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {duplicate.franchisees.map((franchisee, fIndex) => (
                    <div key={franchisee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{franchisee.franchisee_name}</div>
                        <div className="text-sm text-gray-600">
                          {franchisee.company_name && (
                            <span>Empresa: {franchisee.company_name} • </span>
                          )}
                          {franchisee.tax_id && (
                            <span>CIF: {franchisee.tax_id} • </span>
                          )}
                          <span>ID: {franchisee.id.slice(0, 8)}...</span>
                        </div>
                        {franchisee.profiles?.email && (
                          <div className="text-sm text-gray-500">
                            Email: {franchisee.profiles.email}
                          </div>
                        )}
                        <div className="text-xs text-gray-400">
                          Restaurantes: {franchisee.total_restaurants || 0}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {fIndex === 0 ? (
                          <Button
                            size="sm"
                            onClick={() => {
                              const removeIds = duplicate.franchisees
                                .slice(1)
                                .map(f => f.id);
                              handleMerge(franchisee.id, removeIds);
                            }}
                          >
                            <Merge className="w-4 h-4 mr-1" />
                            Mantener este
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleMerge(duplicate.franchisees[0].id, [franchisee.id])}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Recomendación:</strong> El primer franquiciado se mantendrá por defecto. 
                    Verifica que tenga la información más completa antes de fusionar.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
