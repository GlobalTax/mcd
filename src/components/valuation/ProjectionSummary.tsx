
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
  const [tableStyles, setTableStyles] = useState<TableStyles>(defaultStyles);

  if (projections.length === 0) return null;

  const totalCfLibre = projections.reduce((sum, p) => sum + p.cfValue, 0);
  const totalPresentValue = projections.reduce((sum, p) => sum + p.presentValue, 0);

  return (
    <div className="space-y-6">
      <TableStyleEditor styles={tableStyles} onStylesChange={setTableStyles} />
      
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Proyecciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table 
              className="w-full min-w-[600px] border-collapse"
              style={{
                fontSize: tableStyles.fontSize,
                fontFamily: tableStyles.fontFamily,
                borderColor: tableStyles.borderColor
              }}
            >
              <thead>
                <tr>
                  <th 
                    className="border p-2 text-left min-w-[120px]"
                    style={{
                      backgroundColor: tableStyles.headerBg,
                      color: tableStyles.headerTextColor,
                      borderColor: tableStyles.borderColor
                    }}
                  >
                    Período
                  </th>
                  <th 
                    className="border p-2 text-right min-w-[140px]"
                    style={{
                      backgroundColor: tableStyles.headerBg,
                      color: tableStyles.headerTextColor,
                      borderColor: tableStyles.borderColor
                    }}
                  >
                    CF Libre
                  </th>
                  <th 
                    className="border p-2 text-right min-w-[140px]"
                    style={{
                      backgroundColor: tableStyles.headerBg,
                      color: tableStyles.headerTextColor,
                      borderColor: tableStyles.borderColor
                    }}
                  >
                    Valor Presente
                  </th>
                </tr>
              </thead>
              <tbody>
                {projections.map((p, index) => (
                  <tr key={index}>
                    <td 
                      className="border p-2 min-w-[120px]"
                      style={{
                        backgroundColor: tableStyles.cellBg,
                        color: tableStyles.cellTextColor,
                        borderColor: tableStyles.borderColor
                      }}
                    >
                      Año {index + 1}
                      {p.timeToNextYear < 1 && (
                        <span className="text-xs opacity-60">
                          {" "}({(p.timeToNextYear * 12).toFixed(1)} meses)
                        </span>
                      )}
                    </td>
                    <td 
                      className="border p-2 text-right min-w-[140px]"
                      style={{
                        backgroundColor: tableStyles.cellBg,
                        color: tableStyles.cellTextColor,
                        borderColor: tableStyles.borderColor
                      }}
                    >
                      {formatCurrency(p.cfValue)}
                    </td>
                    <td 
                      className="border p-2 text-right min-w-[140px]"
                      style={{
                        backgroundColor: tableStyles.cellBg,
                        color: tableStyles.cellTextColor,
                        borderColor: tableStyles.borderColor
                      }}
                    >
                      {formatCurrency(p.presentValue)}
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td 
                    className="border p-2 min-w-[120px] bg-green-100"
                    style={{
                      borderColor: tableStyles.borderColor,
                      fontFamily: tableStyles.fontFamily
                    }}
                  >
                    TOTAL
                  </td>
                  <td 
                    className="border p-2 text-right min-w-[140px] bg-green-100"
                    style={{
                      borderColor: tableStyles.borderColor,
                      fontFamily: tableStyles.fontFamily
                    }}
                  >
                    {formatCurrency(totalCfLibre)}
                  </td>
                  <td 
                    className="border p-2 text-right min-w-[140px] bg-green-100 text-green-600"
                    style={{
                      borderColor: tableStyles.borderColor,
                      fontFamily: tableStyles.fontFamily
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
