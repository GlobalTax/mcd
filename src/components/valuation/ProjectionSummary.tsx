
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Proyecciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">Período</th>
                <th className="border border-gray-300 p-2 text-right">CF Libre</th>
                <th className="border border-gray-300 p-2 text-right">Valor Presente</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((p, index)  => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    Año {p.year}
                    {p.timeToNextYear < 1 && (
                      <span className="text-xs text-gray-600">
                        {" "}({(p.timeToNextYear * 12).toFixed(1)} meses)
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">{formatCurrency(p.cfValue)}</td>
                  <td className="border border-gray-300 p-2 text-right text-gray-600">{formatCurrency(p.presentValue)}</td>
                </tr>
              ))}
              <tr className="bg-green-100 font-bold">
                <td className="border border-gray-300 p-2">TOTAL</td>
                <td className="border border-gray-300 p-2 text-right">{formatCurrency(projections.reduce((sum, p) => sum + p.cfValue, 0))}</td>
                <td className="border border-gray-300 p-2 text-right text-green-600">{formatCurrency(totalPrice)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectionSummary;
