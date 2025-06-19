import { jsx as _jsx } from "react/jsx-runtime";
import ImprovementsManagement from '@/components/improvements/ImprovementsManagement';
import ProtectedRoute from '@/components/ProtectedRoute';
const ImprovementsPage = () => {
    return (_jsx(ProtectedRoute, { allowedRoles: ['admin', 'superadmin', 'asesor', 'franquiciado'], children: _jsx(ImprovementsManagement, {}) }));
};
export default ImprovementsPage;
