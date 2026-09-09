import { useState, useCallback } from 'react';
import type { DashboardSortState, SortDirection } from '../types/dashboard';

export interface UseDashboardSortingReturn {
  readonly sortState: DashboardSortState;
  readonly toggleAmountSort: () => void;
}

export const useDashboardSorting = (): UseDashboardSortingReturn => {
  const [sortState, setSortState] = useState<DashboardSortState>({
    column: 'amount',
    direction: 'none'
  });

  const toggleAmountSort = useCallback(() => {
    setSortState((prev) => {
      let nextDirection: SortDirection = 'asc';
      if (prev.direction === 'asc') nextDirection = 'desc';
      else if (prev.direction === 'desc') nextDirection = 'none';

      return {
        column: 'amount',
        direction: nextDirection
      };
    });
  }, []);

  return {
    sortState,
    toggleAmountSort
  };
};
