
import React from 'react';
import { ValuationInputs } from '@/types/valuation';

interface BaseYearTableProps {
  inputs: ValuationInputs;
  onInputChange: (key: keyof ValuationInputs, value: number | string) => void;
}

const BaseYearTable = ({ inputs, onInputChange }: BaseYearTableProps) => {
  return null;
};

export default BaseYearTable;
