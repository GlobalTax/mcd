
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Calendar, TrendingUp, DollarSign } from 'lucide-react';
import { ValuationBudget } from '@/types/budget';

interface BudgetListProps {
  budgets: ValuationBudget[];
  onSelectBudget: (budget: ValuationBudget) => void;
  onDeleteBudget: (id: string) => Promise<boolean>;
}

export const BudgetList: React.FC<BudgetListProps> = ({
  budgets,
  onSelectBudget,
  onDeleteBudget
}) => {
  const handleDelete = async (e: React.MouseEvent, budgetId: string) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
      await onDeleteBudget(budgetId);
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

  if (budgets.length === 0) {
    return (
      <div className="p-8 text-center">
        <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay presupuestos de valoración
        </h3>
        <p className="text-gray-500 mb-6">
          Comienza creando tu primer presupuesto para proyectar las finanzas de tus restaurantes.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Presupuestos de Valoración
        </h2>
        <p className="text-gray-600">
          Gestiona y revisa las proyecciones financieras de tus restaurantes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map((budget) => (
          <Card 
            key={budget.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onSelectBudget(budget)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{budget.budget_name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{budget.budget_year}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(budget.status)}
                    >
                      {getStatusText(budget.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Información financiera clave */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Valoración Final</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    €{(budget.final_valuation || 0).toLocaleString('es-ES', { 
                      maximumFractionDigits: 0 
                    })}
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Ventas Iniciales</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    €{budget.initial_sales.toLocaleString('es-ES', { 
                      maximumFractionDigits: 0 
                    })}
                  </p>
                </div>
              </div>

              {/* Parámetros clave */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <p className="text-gray-500">Crecimiento</p>
                  <p className="font-semibold text-green-600">
                    {budget.sales_growth_rate}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Descuento</p>
                  <p className="font-semibold text-purple-600">
                    {budget.discount_rate}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500">Proyección</p>
                  <p className="font-semibold text-blue-600">
                    {budget.years_projection} años
                  </p>
                </div>
              </div>

              {/* Fecha de creación */}
              <div className="text-xs text-gray-500 pt-2 border-t">
                Creado: {new Date(budget.created_at).toLocaleDateString('es-ES')}
              </div>

              {/* Acciones */}
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBudget(budget);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={(e) => handleDelete(e, budget.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
