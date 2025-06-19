import { useState } from 'react';
export const useAuthState = () => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [franchisee, setFranchisee] = useState(null);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const clearUserData = () => {
        console.log('clearUserData - Clearing all user data');
        setUser(null);
        setFranchisee(null);
        setRestaurants([]);
    };
    return {
        user,
        setUser,
        session,
        setSession,
        franchisee,
        setFranchisee,
        restaurants,
        setRestaurants,
        loading,
        setLoading,
        clearUserData
    };
};
