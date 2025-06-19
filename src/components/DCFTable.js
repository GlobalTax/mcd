import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useValuationState } from '@/hooks/useValuationState';
import { useValuationCalculations } from '@/hooks/useValuationCalculations';
import SimpleValuationManager from './valuation/SimpleValuationManager';
import FranchiseInfo from './valuation/FranchiseInfo';
import BaseYearTable from './valuation/BaseYearTable';
import ProjectionTable from './valuation/ProjectionTable';
import ValuationParameters from './valuation/ValuationParameters';
import ValuationResult from './valuation/ValuationResult';
import ProjectionSummary from './valuation/ProjectionSummary';
import { TableStyleEditor } from './valuation/TableStyleEditor';
const DCFTable = () => {
    const { inputs, yearlyData, tableStyles, currentRestaurantId, currentRestaurantName, setTableStyles, handleInputChange, handleYearlyDataChange, handleRestaurantSelected, handleValuationLoaded } = useValuationState();
    const { projections, totalPrice } = useValuationCalculations(inputs, yearlyData);
    const currentValuationData = {
        inputs,
        yearlyData,
        projections,
        totalPrice
    };
    return (_jsx("div", { className: "bg-white min-h-screen", style: { fontFamily: tableStyles.fontFamily }, children: _jsxs("div", { className: "space-y-6 p-6 max-w-full mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Valoraci\u00F3n DCF" }), _jsx(TableStyleEditor, { styles: tableStyles, onStylesChange: setTableStyles }), _jsx(SimpleValuationManager, { onRestaurantSelected: handleRestaurantSelected, onValuationLoaded: handleValuationLoaded, currentData: currentValuationData }), currentRestaurantId && (_jsxs(_Fragment, { children: [_jsx(FranchiseInfo, { inputs: inputs, onInputChange: handleInputChange }), _jsx(BaseYearTable, { inputs: inputs, onInputChange: handleInputChange }), _jsx(ProjectionTable, { inputs: inputs, yearlyData: yearlyData, onYearlyDataChange: handleYearlyDataChange, tableStyles: tableStyles }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsx(ValuationParameters, { inputs: inputs, onInputChange: handleInputChange }), _jsx(ValuationResult, { totalPrice: totalPrice, remainingYears: inputs.remainingYears })] }), projections.length > 0 && (_jsx(ProjectionSummary, { projections: projections, totalPrice: totalPrice }))] }))] }) }));
};
export default DCFTable;
