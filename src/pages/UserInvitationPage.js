import { jsx as _jsx } from "react/jsx-runtime";
import UserInvitationManager from '@/components/admin/UserInvitationManager';
import ProtectedRoute from '@/components/ProtectedRoute';
const UserInvitationPage = () => {
    return (_jsx(ProtectedRoute, { allowedRoles: ['admin', 'superadmin'], children: _jsx(UserInvitationManager, {}) }));
};
export default UserInvitationPage;
