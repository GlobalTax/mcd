
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectionData } from '@/types/valuation';
import { formatCurrency } from '@/utils/valuationUtils';

interface ProjectionSummaryProps {
  projections: ProjectionData[];
  totalPrice: number;
}

const ProjectionSummary = ({ projections, totalPrice }: ProjectionSummaryProps) => {
  if (projections.length === 0) return null;

  const totalPresentValue = projections.reduce((sum, p) => sum + p.presentValue, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Proyecciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left min-w-[120px]">Período</th>
                <th className="border border-gray-300 p-2 text-right min-w-[140px]">CF Libre</th>
                <th className="border border-gray-300 p-2 text-right min-w-[140px]">Valor Presente</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((p, index)  => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 min-w-[120px]">
                    Año {p.year}
                    {p.timeToNextYear < 1 && (
                      <span className="text-xs text-gray-600">
                        {" "}({(p.timeToNextYear * 12).toFixed(1)} meses)
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-right min-w-[140px]">{formatCurrency(p.cfValue)}</td>
                  <td className="border border-gray-300 p-2 text-right text-gray-600 min-w-[140px]">{formatCurrency(p.presentValue)}</td>
                </tr>
              ))}
              <tr className="bg-green-100 font-bold">
                <td className="border border-gray-300 p-2 min-w-[120px]">TOTAL</td>
                <td className="border border-gray-300 p-2 text-right min-w-[140px]">{formatCurrency(projections.reduce((sum, p) => sum + p.cfValue, 0))}</td>
                <td className="border border-gray-300 p-2 text-right text-green-600 min-w-[140px]">{formatCurrency(totalPresentValue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectionSummary;
