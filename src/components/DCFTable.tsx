
import React from 'react';
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
  const {
    inputs,
    yearlyData,
    tableStyles,
    currentRestaurantId,
    currentRestaurantName,
    setTableStyles,
    handleInputChange,
    handleYearlyDataChange,
    handleRestaurantSelected,
    handleValuationLoaded
  } = useValuationState();

  const { projections, totalPrice } = useValuationCalculations(inputs, yearlyData);

  const currentValuationData = {
    inputs,
    yearlyData,
    projections,
    totalPrice
  };

  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: tableStyles.fontFamily }}>
      <div className="space-y-6 p-6 max-w-full mx-auto">
        <h2 className="text-2xl font-bold text-gray-900">Valoración DCF</h2>

        <TableStyleEditor 
          styles={tableStyles}
          onStylesChange={setTableStyles}
        />

        <SimpleValuationManager
          onRestaurantSelected={handleRestaurantSelected}
          onValuationLoaded={handleValuationLoaded}
          currentData={currentValuationData}
        />

        {currentRestaurantId && (
          <>
            <FranchiseInfo 
              inputs={inputs} 
              onInputChange={handleInputChange}
            />

            <BaseYearTable 
              inputs={inputs} 
              onInputChange={handleInputChange}
            />

            <ProjectionTable 
              inputs={inputs}
              yearlyData={yearlyData}
              onYearlyDataChange={handleYearlyDataChange}
              tableStyles={tableStyles}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ValuationParameters 
                inputs={inputs} 
                onInputChange={handleInputChange}
              />

              <ValuationResult 
                totalPrice={totalPrice}
                remainingYears={inputs.remainingYears}
              />
            </div>

            {projections.length > 0 && (
              <ProjectionSummary 
                projections={projections}
                totalPrice={totalPrice}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DCFTable;
