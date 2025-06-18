
import { useState } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { User, Franchisee, Restaurant } from '@/types/auth';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [franchisee, setFranchisee] = useState<Franchisee | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
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
