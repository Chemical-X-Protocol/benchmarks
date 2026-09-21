import { useState } from 'react';

export interface DashboardPaginationState {
  readonly pageSize: number;
  readonly currentPage: number;
}

export interface DashboardPaginationActions {
  readonly setPageSize: (size: number) => void;
  readonly setCurrentPage: (page: number) => void;
}

export interface UseDashboardPaginationReturn {
  readonly state: DashboardPaginationState;
  readonly actions: DashboardPaginationActions;
}

export const useDashboardPagination = (
  initialPageSize: number = 10,
  initialPage: number = 1
): UseDashboardPaginationReturn => {
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  return {
    state: { pageSize, currentPage },
    actions: { setPageSize, setCurrentPage }
  };
};

export default useDashboardPagination;
