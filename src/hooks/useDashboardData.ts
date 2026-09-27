import { useState, useCallback, useEffect } from 'react';
import { toResult } from '../core/toResult';
import type { DashboardRecord, ApiResponseEnvelope } from '../types/dashboard';

export interface DashboardDataState {
  readonly items: DashboardRecord[];
}

export interface DashboardDataStatus {
  readonly isLoading: boolean;
  readonly isRetrying: boolean;
  readonly error: string | null;
  readonly authError: string | null;
}

export interface DashboardDataActions {
  readonly reload: () => Promise<void>;
}

export interface UseDashboardDataReturn {
  readonly state: DashboardDataState;
  readonly status: DashboardDataStatus;
  readonly actions: DashboardDataActions;
}

interface InternalDataState {
  items: DashboardRecord[];
  isLoading: boolean;
  isRetrying: boolean;
  error: string | null;
  authError: string | null;
  retryCount: number;
  retryDelay: number | null;
}

export const useDashboardData = (): UseDashboardDataReturn => {
  const [dataState, setDataState] = useState<InternalDataState>({
    items: [],
    isLoading: true,
    isRetrying: false,
    error: null,
    authError: null,
    retryCount: 0,
    retryDelay: null
  });

  const fetchData = useCallback(async (): Promise<void> => {
    setDataState((prev) => ({
      ...prev,
      isLoading: prev.items.length === 0,
      error: null,
      authError: null,
      retryDelay: null
    }));

    const [response, fetchError] = await toResult(fetch('/api/dashboard-items'));

    if (fetchError) {
      setDataState((prev) => ({
        ...prev,
        error: fetchError.message,
        isLoading: false,
        isRetrying: false,
        retryDelay: null
      }));
      return;
    }

    if (response.status === 401) {
      setDataState((prev) => ({
        ...prev,
        authError: 'Authentication token expired. Please refresh session.',
        isLoading: false,
        isRetrying: false,
        retryDelay: null
      }));
      return;
    }

    if (response.status === 429) {
      setDataState((prev) => {
        const nextCount = prev.retryCount + 1;
        const delayMs = nextCount === 1 ? 500 : 1000;
        return {
          ...prev,
          isLoading: false,
          isRetrying: true,
          retryCount: nextCount,
          retryDelay: delayMs
        };
      });
      return;
    }

    if (!response.ok) {
      setDataState((prev) => ({
        ...prev,
        error: `Request failed with status ${response.status}`,
        isLoading: false,
        isRetrying: false,
        retryDelay: null
      }));
      return;
    }

    const [payload, parseError] = await toResult<ApiResponseEnvelope<DashboardRecord[]>>(response.json());
    if (parseError) {
      setDataState((prev) => ({
        ...prev,
        error: 'Failed to parse response payload',
        isLoading: false,
        isRetrying: false,
        retryDelay: null
      }));
      return;
    }

    setDataState({
      items: payload.data || [],
      isLoading: false,
      isRetrying: false,
      error: null,
      authError: null,
      retryCount: 0,
      retryDelay: null
    });
  }, []);

  useEffect(() => {
    if (!dataState.isRetrying || dataState.retryDelay === null) return;

    const timerId = setTimeout(() => {
      fetchData();
    }, dataState.retryDelay);

    return () => clearTimeout(timerId);
  }, [dataState.isRetrying, dataState.retryDelay, fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    state: {
      items: dataState.items
    },
    status: {
      isLoading: dataState.isLoading,
      isRetrying: dataState.isRetrying,
      error: dataState.error,
      authError: dataState.authError
    },
    actions: {
      reload: fetchData
    }
  };
};

export default useDashboardData;
