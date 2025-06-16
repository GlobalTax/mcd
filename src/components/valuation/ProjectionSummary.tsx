
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectionData } from '@/types/valuation';
import { formatCurrency } from '@/utils/valuationUtils';
import { TableStyleEditor, defaultStyles, TableStyles } from './TableStyleEditor';

interface ProjectionSummaryProps {
  projections: ProjectionData[];
  totalPrice: number;
}

const ProjectionSummary = ({ projections, totalPrice }: ProjectionSummaryProps) => {
  const [tableStyles, setTableStyles] = useState<TableStyles>({
    ...defaultStyles,
    fontFamily: 'Manrope, Inter, system-ui, sans-serif'
  });

  if (projections.length === 0) return null;

  const totalCfLibre = projections.reduce((sum, p) => sum + p.cfValue, 0);
  const totalPresentValue = projections.reduce((sum, p) => sum + p.presentValue, 0);

  return (
    <div className="space-y-6">
      <TableStyleEditor styles={tableStyles} onStylesChange={setTableStyles} />
      
      <Card>
        <CardHeader>
          <CardTitle className="font-manrope">Resumen de Proyecciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table 
              className="w-full min-w-[600px] border-collapse font-manrope"
              style={{
                fontSize: tableStyles.fontSize,
                fontFamily: 'Manrope, Inter, system-ui, sans-serif',
                borderColor: tableStyles.borderColor
              }}
            >
              <thead>
                <tr>
                  <th 
                    className="border p-3 text-left min-w-[120px] font-semibold"
                    style={{
                      backgroundColor: tableStyles.headerBg,
                      color: tableStyles.headerTextColor,
                      borderColor: tableStyles.borderColor,
                      fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                    }}
                  >
                    Período
                  </th>
                  <th 
                    className="border p-3 text-right min-w-[140px] font-semibold"
                    style={{
                      backgroundColor: tableStyles.headerBg,
                      color: tableStyles.headerTextColor,
                      borderColor: tableStyles.borderColor,
                      fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                    }}
                  >
                    CF Libre
                  </th>
                  <th 
                    className="border p-3 text-right min-w-[140px] font-semibold"
                    style={{
                      backgroundColor: tableStyles.headerBg,
                      color: tableStyles.headerTextColor,
                      borderColor: tableStyles.borderColor,
                      fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                    }}
                  >
                    Valor Presente
                  </th>
                </tr>
              </thead>
              <tbody>
                {projections.map((p, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td 
                      className="border p-3 min-w-[120px]"
                      style={{
                        backgroundColor: tableStyles.cellBg,
                        color: tableStyles.cellTextColor,
                        borderColor: tableStyles.borderColor,
                        fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                      }}
                    >
                      <span className="font-medium">Año {index + 1}</span>
                      {p.timeToNextYear < 1 && (
                        <span className="text-xs opacity-60 ml-1">
                          ({(p.timeToNextYear * 12).toFixed(1)} meses)
                        </span>
                      )}
                    </td>
                    <td 
                      className="border p-3 text-right min-w-[140px] font-medium"
                      style={{
                        backgroundColor: tableStyles.cellBg,
                        color: tableStyles.cellTextColor,
                        borderColor: tableStyles.borderColor,
                        fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                      }}
                    >
                      {formatCurrency(p.cfValue)}
                    </td>
                    <td 
                      className="border p-3 text-right min-w-[140px] font-medium"
                      style={{
                        backgroundColor: tableStyles.cellBg,
                        color: tableStyles.cellTextColor,
                        borderColor: tableStyles.borderColor,
                        fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                      }}
                    >
                      {formatCurrency(p.presentValue)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold bg-green-50 border-t-2 border-green-200">
                  <td 
                    className="border p-4 min-w-[120px] text-green-800 font-bold"
                    style={{
                      borderColor: tableStyles.borderColor,
                      fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                    }}
                  >
                    TOTAL
                  </td>
                  <td 
                    className="border p-4 text-right min-w-[140px] text-green-800 font-bold"
                    style={{
                      borderColor: tableStyles.borderColor,
                      fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                    }}
                  >
                    {formatCurrency(totalCfLibre)}
                  </td>
                  <td 
                    className="border p-4 text-right min-w-[140px] text-green-600 font-bold"
                    style={{
                      borderColor: tableStyles.borderColor,
                      fontFamily: 'Manrope, Inter, system-ui, sans-serif'
                    }}
                  >
                    {formatCurrency(totalPresentValue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectionSummary;
