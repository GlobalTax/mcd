import { jsx as _jsx } from "react/jsx-runtime";
import BudgetReports from '@/components/budget/BudgetReports';
import ProtectedRoute from '@/components/ProtectedRoute';
const BudgetReportsPage = () => {
    return (_jsx(ProtectedRoute, { allowedRoles: ['franchisee', 'asesor', 'admin', 'superadmin'], children: _jsx(BudgetReports, {}) }));
};
export default BudgetReportsPage;
