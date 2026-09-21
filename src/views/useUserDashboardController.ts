import { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { useDashboardSorting } from '../hooks/useDashboardSorting';
import { useDashboardPagination } from '../hooks/useDashboardPagination';
import type { DashboardRecord, DashboardFilterState, DashboardSortState, RecordCategory } from '../types/dashboard';

export interface UserDashboardState {
  readonly items: DashboardRecord[];
  readonly visibleItems: DashboardRecord[];
  readonly filters: DashboardFilterState;
  readonly sortState: DashboardSortState;
  readonly pageSize: number;
  readonly currentPage: number;
  readonly isExportModalOpen: boolean;
}

export interface UserDashboardStatus {
  readonly isLoading: boolean;
  readonly isRetrying: boolean;
  readonly error: string | null;
  readonly authError: string | null;
}

export interface UserDashboardActions {
  readonly reload: () => Promise<void>;
  readonly setCategory: (category: RecordCategory) => void;
  readonly setSearchQuery: (query: string) => void;
  readonly setPageSize: (size: number) => void;
  readonly setCurrentPage: (page: number) => void;
  readonly toggleAmountSort: () => void;
  readonly openExportModal: () => void;
  readonly closeExportModal: () => void;
  readonly exportJson: () => void;
}

export interface UseUserDashboardControllerReturn {
  readonly state: UserDashboardState;
  readonly status: UserDashboardStatus;
  readonly actions: UserDashboardActions;
}

const computeVisibleItems = (
  items: DashboardRecord[],
  filters: DashboardFilterState,
  sortState: DashboardSortState
): DashboardRecord[] => {
  let result = [...items];

  if (filters.category !== 'all') {
    result = result.filter((item) => item.category === filters.category);
  }

  const query = filters.searchQuery.trim().toLowerCase();
  if (query.length > 0) {
    result = result.filter(
      (item) => item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)
    );
  }

  if (sortState.column === 'amount' && sortState.direction !== 'none') {
    result.sort((a, b) =>
      sortState.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount
    );
  }

  return result;
};

const triggerJsonDownload = (records: DashboardRecord[]): void => {
  const downloadFn = (window as unknown as { mockDownloadFn?: () => void }).mockDownloadFn;
  if (downloadFn) {
    downloadFn();
    return;
  }
  const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `export-${Date.now()}.json`;
  link.click();
};

export const useUserDashboardController = (): UseUserDashboardControllerReturn => {
  const { state: dataState, status: dataStatus, actions: dataActions } = useDashboardData();
  const { filters, setCategory, setSearchQuery } = useDashboardFilters();
  const { sortState, toggleAmountSort } = useDashboardSorting();
  const { state: paginationState, actions: paginationActions } = useDashboardPagination();
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const visibleItems = computeVisibleItems(dataState.items, filters, sortState);

  const openExportModal = () => setIsExportModalOpen(true);
  const closeExportModal = () => setIsExportModalOpen(false);
  const exportJson = () => triggerJsonDownload(visibleItems);

  return {
    state: {
      items: dataState.items,
      visibleItems,
      filters,
      sortState,
      pageSize: paginationState.pageSize,
      currentPage: paginationState.currentPage,
      isExportModalOpen
    },
    status: {
      isLoading: dataStatus.isLoading,
      isRetrying: dataStatus.isRetrying,
      error: dataStatus.error,
      authError: dataStatus.authError
    },
    actions: {
      reload: dataActions.reload,
      setCategory,
      setSearchQuery,
      setPageSize: paginationActions.setPageSize,
      setCurrentPage: paginationActions.setCurrentPage,
      toggleAmountSort,
      openExportModal,
      closeExportModal,
      exportJson
    }
  };
};

export default useUserDashboardController;
