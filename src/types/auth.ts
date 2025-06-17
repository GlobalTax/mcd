
export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'franchisee' | 'advisor' | 'admin' | 'superadmin';
  phone?: string;
}

export interface Franchisee {
  id: string;
  user_id: string;
  franchisee_name: string;
  company_name?: string;
  tax_id?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  created_at: string;
  updated_at: string;
  total_restaurants?: number;
  profiles?: {
    email: string;
    full_name?: string;
    phone?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error?: string }>;
}
