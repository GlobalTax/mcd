
import { BudgetData } from '@/types/budgetTypes';

export interface BudgetTableProps {
  data: BudgetData[];
  actualData?: any[];
  onCellChange: (id: string, field: string, value: number) => void;
  onActualChange?: (id: string, field: string, value: number) => void;
  viewMode?: 'budget' | 'comparison' | 'actuals';
  showOnlySummary?: boolean;
}

export interface EditingCell {
  rowId: string;
  field: string;
  isActual?: boolean;
}

export interface Month {
  key: string;
  label: string;
}

export interface HeaderLabels {
  monthSubheaders: JSX.Element;
  totalSubheaders: JSX.Element;
}
