
export interface FranchiseeInvitation {
  id: string;
  franchisee_id: string;
  email: string;
  invited_by: string;
  invitation_token: string;
  status: 'pending' | 'accepted' | 'expired';
  invited_at: string;
  accepted_at?: string;
  expires_at: string;
}

export interface FranchiseeAccessLog {
  id: string;
  franchisee_id: string;
  user_id?: string;
  login_time: string;
  logout_time?: string;
  ip_address?: string;
  user_agent?: string;
  session_duration?: number;
}

export interface FranchiseeActivityLog {
  id: string;
  franchisee_id: string;
  user_id?: string;
  activity_type: string;
  activity_description?: string;
  entity_type?: string;
  entity_id?: string;
  metadata?: any;
  created_at: string;
}
