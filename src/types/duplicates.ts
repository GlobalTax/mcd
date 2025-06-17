
import { Franchisee } from '@/types/auth';

export interface DuplicateGroup {
  key: string;
  franchisees: Franchisee[];
  count: number;
  reasons: string[];
}

export interface MergeResult {
  success: boolean;
  error?: string;
  mergedFranchisee?: Franchisee;
}
