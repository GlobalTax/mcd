
export interface BudgetData {
  id: string;
  category: string;
  subcategory?: string;
  isCategory: boolean;
  jan: number;
  feb: number;
  mar: number;
  apr: number;
  may: number;
  jun: number;
  jul: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  total: number;
}

export interface BudgetDataHookReturn {
  rowData: BudgetData[];
  hasChanges: boolean;
  loading: boolean;
  error: string | null;
  handleCellChange: (id: string, field: string, value: number) => void;
  handleSave: () => Promise<void>;
  reloadData: () => void;
}
