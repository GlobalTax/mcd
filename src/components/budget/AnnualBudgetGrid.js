import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useBudgetData } from '@/hooks/useBudgetData';
import { useActualData } from '@/hooks/useActualData';
import { useFranchiseeRestaurants } from '@/hooks/useFranchiseeRestaurants';
import { BudgetTable } from './BudgetTable';
import { BudgetGridHeader } from './BudgetGridHeader';
import { BudgetGridStatus } from './BudgetGridStatus';
import { BudgetChangesBanner } from './BudgetChangesBanner';
import { toast } from 'sonner';
export const AnnualBudgetGrid = ({ restaurantId, year }) => {
    const [viewMode, setViewMode] = useState('budget');
    const [showOnlySummary, setShowOnlySummary] = useState(false);
    const { restaurants } = useFranchiseeRestaurants();
    const { rowData, hasChanges, loading, error, handleCellChange, handleSave, reloadData } = useBudgetData(restaurantId, year);
    const { actualData, loading: actualLoading, error: actualError, fetchActualData, updateActualData } = useActualData();
    const selectedRestaurant = restaurants.find(r => r.id === restaurantId);
    const restaurantName = selectedRestaurant?.base_restaurant?.restaurant_name;
    // Cargar datos reales automáticamente
    useEffect(() => {
        if (restaurantId && year) {
            fetchActualData(restaurantId, year);
        }
    }, [restaurantId, year, fetchActualData]);
    const handleToggleViewMode = (mode) => {
        setViewMode(mode);
    };
    const handleToggleSummary = () => {
        setShowOnlySummary(!showOnlySummary);
    };
    // Nueva función para manejar cambios en datos reales
    const handleActualChange = async (rowId, field, value) => {
        try {
            // Buscar la fila correspondiente para obtener categoría y subcategoría
            const row = rowData.find(r => r.id === rowId);
            if (!row)
                return;
            await updateActualData({
                restaurant_id: restaurantId,
                year,
                category: row.category,
                subcategory: row.subcategory || '',
                [field]: value
            });
            // Recargar datos reales
            fetchActualData(restaurantId, year);
            toast.success('Dato real actualizado correctamente');
        }
        catch (error) {
            console.error('Error updating actual data:', error);
            toast.error('Error al actualizar el dato real');
        }
    };
    // Mostrar estados de carga o error
    if (loading || error) {
        return (_jsx(BudgetGridStatus, { loading: loading, error: error, onReload: reloadData }));
    }
    return (_jsxs(Card, { className: "w-full", children: [_jsxs(CardHeader, { className: "pb-4", children: [_jsx(BudgetGridHeader, { year: year, hasChanges: hasChanges, loading: loading, budgetData: rowData, restaurantName: restaurantName, onSave: handleSave, viewMode: viewMode, onToggleViewMode: handleToggleViewMode, showOnlySummary: showOnlySummary, onToggleSummary: handleToggleSummary }), _jsx(BudgetChangesBanner, { hasChanges: hasChanges })] }), _jsx(CardContent, { className: "p-0", children: _jsx(BudgetTable, { data: rowData, actualData: actualData, onCellChange: handleCellChange, onActualChange: handleActualChange, viewMode: viewMode, showOnlySummary: showOnlySummary }) })] }));
};
