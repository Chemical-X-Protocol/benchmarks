import { useState, useCallback, useEffect } from 'react';
import { toResult } from '../core/toResult';
import type { DashboardRecord, ApiResponseEnvelope } from '../types/dashboard';

export interface UseDashboardDataReturn {
  readonly items: DashboardRecord[];
  readonly isLoading: boolean;
  readonly error: string | null;
  readonly authError: string | null;
  readonly isRetrying: boolean;
  readonly reload: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [items, setItems] = useState<DashboardRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const fetchData = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setAuthError(null);

    const [response, fetchError] = await toResult(fetch('/api/dashboard-items'));

    if (fetchError) {
      setError(fetchError.message);
      setIsLoading(false);
      return;
    }

    if (response.status === 401) {
      setAuthError('Authentication token expired. Please refresh session.');
      setIsLoading(false);
      return;
    }

    if (response.status === 429) {
      setIsRetrying(true);
      return;
    }

    if (!response.ok) {
      setError(`Request failed with status ${response.status}`);
      setIsLoading(false);
      return;
    }

    const [payload, parseError] = await toResult<ApiResponseEnvelope<DashboardRecord[]>>(response.json());
    if (parseError) {
      setError('Failed to parse response payload');
      setIsLoading(false);
      return;
    }

    setItems(payload.data || []);
    setIsRetrying(false);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    items,
    isLoading,
    error,
    authError,
    isRetrying,
    reload: fetchData
  };
};
