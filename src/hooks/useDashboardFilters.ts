import { useState, useEffect, useCallback } from 'react';
import type { RecordCategory, DashboardFilterState } from '../types/dashboard';

export interface UseDashboardFiltersReturn {
  readonly filters: DashboardFilterState;
  readonly setCategory: (category: RecordCategory) => void;
  readonly setSearchQuery: (query: string) => void;
}

const getInitialCategory = (): RecordCategory => {
  if (typeof window === 'undefined') return 'all';
  const params = new URLSearchParams(window.location.search);
  const paramCat = params.get('category');

  // Stage 1: Concept booleans
  const isBilling = paramCat === 'billing';
  const isSecurity = paramCat === 'security';
  const isOperations = paramCat === 'operations';

  // Stage 2: Decision boolean & early guard
  const isValidCategory = isBilling || isSecurity || isOperations;
  if (isValidCategory) {
    return paramCat as RecordCategory;
  }
  return 'all';
};

export const useDashboardFilters = (): UseDashboardFiltersReturn => {
  const [category, setCategoryState] = useState<RecordCategory>(getInitialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const syncUrlCategory = useCallback((nextCategory: RecordCategory) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const currentParam = url.searchParams.get('category');

    if (nextCategory === 'all' && currentParam) {
      url.searchParams.delete('category');
      const targetSearch = url.search ? url.search : '';
      window.history.pushState({}, '', `${url.pathname}${targetSearch}`);
    } else if (nextCategory !== 'all' && currentParam !== nextCategory) {
      url.searchParams.set('category', nextCategory);
      window.history.pushState({}, '', `${url.pathname}${url.search}`);
    }
  }, []);

  const setCategory = useCallback((nextCategory: RecordCategory) => {
    setCategoryState(nextCategory);
    syncUrlCategory(nextCategory);
  }, [syncUrlCategory]);

  useEffect(() => {
    const handlePopState = () => {
      setCategoryState(getInitialCategory());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    filters: { category, searchQuery },
    setCategory,
    setSearchQuery
  };
};
