import { useCallback, useMemo } from 'react';
import { fetchRepositories, fetchStarredRepos } from '../services';
import { useAsync } from './useAsync';
import type { GitHubRepository } from '../types';

interface UseRepositoriesOptions {
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  perPage?: number;
}

interface UseRepositoriesReturn {
  repositories: GitHubRepository[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useRepositories(
  username: string,
  options?: UseRepositoriesOptions
): UseRepositoriesReturn {
  const sort = options?.sort || 'updated';
  const direction = options?.direction || 'desc';
  const perPage = options?.perPage || 30;

  const fetchFn = useCallback(
    () => fetchRepositories(username, { sort, direction, perPage }),
    [username, sort, direction, perPage]
  );

  const { data, isLoading, error, execute } = useAsync<GitHubRepository[]>(fetchFn, true);

  return useMemo(() => ({
    repositories: data || [],
    isLoading,
    error,
    refetch: execute,
  }), [data, isLoading, error, execute]);
}

export function useStarredRepositories(
  username: string,
  perPage = 30
): UseRepositoriesReturn {
  const fetchFn = useCallback(
    () => fetchStarredRepos(username, perPage),
    [username, perPage]
  );

  const { data, isLoading, error, execute } = useAsync<GitHubRepository[]>(fetchFn, true);

  return useMemo(() => ({
    repositories: data || [],
    isLoading,
    error,
    refetch: execute,
  }), [data, isLoading, error, execute]);
}

