
import { BudgetData } from '@/types/budgetTypes';

export interface EditingCell {
  rowId: string;
  field: string;
  isActual?: boolean; // Flag para distinguir si estamos editando presupuesto o real
}

export interface BudgetTableProps {
  data: BudgetData[];
  actualData?: any[];
  onCellChange: (id: string, field: string, value: number) => void;
  onActualChange?: (id: string, field: string, value: number) => void; // Nueva función para cambios en datos reales
  viewMode?: 'budget' | 'comparison' | 'actuals';
  showOnlySummary?: boolean;
}
