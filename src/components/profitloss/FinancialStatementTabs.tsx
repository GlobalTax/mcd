
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import ProfitLossDashboard from './ProfitLossDashboard';
import { BalanceSheetStatement } from './BalanceSheetStatement';
import { CashFlowStatement } from './CashFlowStatement';

interface FinancialStatementTabsProps {
  restaurantId: string;
}

export const FinancialStatementTabs: React.FC<FinancialStatementTabsProps> = ({ restaurantId }) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [activeTab, setActiveTab] = useState('profit-loss');

  // Generar años disponibles (último 5 años + próximo año)
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from({ length: 6 }, (_, i) => currentYear - 4 + i);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Estados Financieros</h1>
          <p className="text-gray-600">Análisis completo del restaurante {restaurantId}</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Summary Report
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Financial Statement Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profit-loss" className="text-sm font-medium">
            Profit & Loss
          </TabsTrigger>
          <TabsTrigger value="balance-sheet" className="text-sm font-medium">
            Balance Sheet
          </TabsTrigger>
          <TabsTrigger value="cash-flow" className="text-sm font-medium">
            Cash Flow Statement
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profit-loss" className="space-y-6">
          <ProfitLossDashboard restaurantId={restaurantId} />
        </TabsContent>

        <TabsContent value="balance-sheet" className="space-y-6">
          <BalanceSheetStatement restaurantId={restaurantId} year={selectedYear} />
        </TabsContent>

        <TabsContent value="cash-flow" className="space-y-6">
          <CashFlowStatement restaurantId={restaurantId} year={selectedYear} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
