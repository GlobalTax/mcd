import { jsx as _jsx } from "react/jsx-runtime";
import BudgetAnalysis from '@/components/budget/BudgetAnalysis';
import ProtectedRoute from '@/components/ProtectedRoute';
const BudgetAnalysisPage = () => {
    return (_jsx(ProtectedRoute, { allowedRoles: ['franchisee', 'asesor', 'admin', 'superadmin'], children: _jsx(BudgetAnalysis, {}) }));
};
export default BudgetAnalysisPage;
