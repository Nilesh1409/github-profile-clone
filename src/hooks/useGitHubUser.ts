import { useCallback, useMemo } from 'react';
import { fetchUser } from '../services';
import { useAsync } from './useAsync';
import type { GitHubUser } from '../types';

interface UseGitHubUserReturn {
  user: GitHubUser | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useGitHubUser(username: string): UseGitHubUserReturn {
  const fetchFn = useCallback(() => fetchUser(username), [username]);
  
  const { data, isLoading, error, execute } = useAsync<GitHubUser>(fetchFn, true);

  return useMemo(() => ({
    user: data,
    isLoading,
    error,
    refetch: execute,
  }), [data, isLoading, error, execute]);
}

