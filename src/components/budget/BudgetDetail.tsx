
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Download, Calculator } from 'lucide-react';
import { ValuationBudget } from '@/types/budget';

interface BudgetDetailProps {
  budget: ValuationBudget;
  onUpdate: (id: string, data: any) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onBack: () => void;
}

export const BudgetDetail: React.FC<BudgetDetailProps> = ({
  budget,
  onUpdate,
  onDelete,
  onBack
}) => {
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      const success = await onDelete(budget.id);
      if (success) {
        onBack();
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Borrador';
      case 'approved':
        return 'Aprobado';
      case 'archived':
        return 'Archivado';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {budget.budget_name}
            </h2>
            <div className="flex items-center gap-4">
              <Badge 
                variant="outline" 
                className={getStatusColor(budget.status)}
              >
                {getStatusText(budget.status)}
              </Badge>
              <span className="text-gray-600">
                Año: {budget.budget_year}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resumen Financiero */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Resumen Financiero
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-700">Valoración Final</p>
                <p className="text-2xl font-bold text-green-600">
                  €{(budget.final_valuation || 0).toLocaleString('es-ES', { 
                    maximumFractionDigits: 0 
                  })}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-700">Ventas Iniciales</p>
                <p className="text-2xl font-bold text-blue-600">
                  €{budget.initial_sales.toLocaleString('es-ES', { 
                    maximumFractionDigits: 0 
                  })}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-500">Crecimiento</p>
                <p className="font-semibold text-green-600">
                  {budget.sales_growth_rate}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Descuento</p>
                <p className="font-semibold text-purple-600">
                  {budget.discount_rate}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Proyección</p>
                <p className="font-semibold text-blue-600">
                  {budget.years_projection} años
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parámetros de Valoración */}
        <Card>
          <CardHeader>
            <CardTitle>Parámetros de Valoración</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tasa de Inflación:</span>
              <span className="font-medium">{budget.inflation_rate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PAC:</span>
              <span className="font-medium">{budget.pac_percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Alquiler:</span>
              <span className="font-medium">{budget.rent_percentage}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tarifas de Servicio:</span>
              <span className="font-medium">{budget.service_fees_percentage}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Costos Fijos */}
        <Card>
          <CardHeader>
            <CardTitle>Costos Fijos Anuales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Depreciación:</span>
              <span className="font-medium">€{budget.depreciation.toLocaleString('es-ES')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Intereses:</span>
              <span className="font-medium">€{budget.interest.toLocaleString('es-ES')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pago de Préstamo:</span>
              <span className="font-medium">€{budget.loan_payment.toLocaleString('es-ES')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Índice de Alquiler:</span>
              <span className="font-medium">€{budget.rent_index.toLocaleString('es-ES')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Misceláneos:</span>
              <span className="font-medium">€{budget.miscellaneous.toLocaleString('es-ES')}</span>
            </div>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Fecha de Creación:</p>
              <p className="font-medium">
                {new Date(budget.created_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Última Actualización:</p>
              <p className="font-medium">
                {new Date(budget.updated_at).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {budget.notes && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Notas:</p>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">
                  {budget.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
