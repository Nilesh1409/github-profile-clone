import { useState, useCallback, useEffect, useRef } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: () => Promise<void>;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
): UseAsyncReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });

  const mountedRef = useRef(true);
  const asyncFunctionRef = useRef(asyncFunction);
  
  // Update the ref when asyncFunction changes
  asyncFunctionRef.current = asyncFunction;

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await asyncFunctionRef.current();
      if (mountedRef.current) {
        setState({ data: response, error: null, isLoading: false });
      }
    } catch (err) {
      if (mountedRef.current) {
        setState({ 
          data: null, 
          error: err instanceof Error ? err : new Error(String(err)), 
          isLoading: false 
        });
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    
    if (immediate) {
      execute();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [execute, immediate]);

  return { ...state, execute };
}

