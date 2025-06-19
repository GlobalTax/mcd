import { jsx as _jsx } from "react/jsx-runtime";
import UserProfile from '@/components/UserProfile';
import ProtectedRoute from '@/components/ProtectedRoute';
const ProfilePage = () => {
    return (_jsx(ProtectedRoute, { children: _jsx(UserProfile, {}) }));
};
export default ProfilePage;
