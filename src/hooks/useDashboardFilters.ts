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
  if (paramCat === 'billing' || paramCat === 'security' || paramCat === 'operations') {
    return paramCat;
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
      window.history.pushState({}, '', url.toString());
    } else if (nextCategory !== 'all' && currentParam !== nextCategory) {
      url.searchParams.set('category', nextCategory);
      window.history.pushState({}, '', url.toString());
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
