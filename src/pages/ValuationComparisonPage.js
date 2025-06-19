import { jsx as _jsx } from "react/jsx-runtime";
import ValuationComparison from '@/components/valuation/ValuationComparison';
import ProtectedRoute from '@/components/ProtectedRoute';
const ValuationComparisonPage = () => {
    return (_jsx(ProtectedRoute, { allowedRoles: ['franchisee', 'asesor', 'admin', 'superadmin'], children: _jsx(ValuationComparison, {}) }));
};
export default ValuationComparisonPage;
