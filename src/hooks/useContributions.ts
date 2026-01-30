import { useCallback, useMemo } from 'react';
import { fetchContributions } from '../services';
import { useAsync } from './useAsync';
import type { ContributionData } from '../types';

interface UseContributionsReturn {
  contributions: ContributionData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  totalContributions: number;
  currentYearContributions: number;
}

export function useContributions(username: string): UseContributionsReturn {
  const fetchFn = useCallback(() => fetchContributions(username), [username]);
  
  const { data, isLoading, error, execute } = useAsync<ContributionData>(fetchFn, true);

  const currentYear = new Date().getFullYear().toString();

  return useMemo(() => ({
    contributions: data,
    isLoading,
    error,
    refetch: execute,
    totalContributions: data?.total 
      ? Object.values(data.total).reduce((sum, count) => sum + count, 0) 
      : 0,
    currentYearContributions: data?.total?.[currentYear] || 0,
  }), [data, isLoading, error, execute, currentYear]);
}

