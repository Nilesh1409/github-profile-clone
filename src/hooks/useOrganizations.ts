import { useCallback, useMemo } from 'react';
import { fetchOrganizations } from '../services';
import { useAsync } from './useAsync';
import type { GitHubOrganization } from '../types';

interface UseOrganizationsReturn {
  organizations: GitHubOrganization[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useOrganizations(username: string): UseOrganizationsReturn {
  const fetchFn = useCallback(() => fetchOrganizations(username), [username]);
  
  const { data, isLoading, error, execute } = useAsync<GitHubOrganization[]>(fetchFn, true);

  return useMemo(() => ({
    organizations: data || [],
    isLoading,
    error,
    refetch: execute,
  }), [data, isLoading, error, execute]);
}

