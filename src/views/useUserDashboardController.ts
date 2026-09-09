import { useState, useMemo, useCallback } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { useDashboardSorting } from '../hooks/useDashboardSorting';
import type { DashboardRecord } from '../types/dashboard';

export const useUserDashboardController = () => {
  const { items, isLoading, error, authError, isRetrying, reload } = useDashboardData();
  const { filters, setCategory, setSearchQuery } = useDashboardFilters();
  const { sortState, toggleAmountSort } = useDashboardSorting();

  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const visibleItems = useMemo(() => {
    let result = [...items];

    if (filters.category !== 'all') {
      result = result.filter((item) => item.category === filters.category);
    }

    if (filters.searchQuery.trim().length > 0) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
      );
    }

    if (sortState.column === 'amount' && sortState.direction !== 'none') {
      result.sort((a, b) =>
        sortState.direction === 'asc' ? a.amount - b.amount : b.amount - a.amount
      );
    }

    return result;
  }, [items, filters, sortState]);

  const exportJson = useCallback(() => {
    const downloadFn = (window as unknown as { mockDownloadFn?: () => void }).mockDownloadFn;
    if (downloadFn) {
      downloadFn();
    } else {
      const blob = new Blob([JSON.stringify(visibleItems, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export-${Date.now()}.json`;
      link.click();
    }
  }, [visibleItems]);

  return {
    items,
    visibleItems,
    isLoading,
    error,
    authError,
    isRetrying,
    filters,
    sortState,
    pageSize,
    currentPage,
    isExportModalOpen,
    reload,
    setCategory,
    setSearchQuery,
    setPageSize,
    setCurrentPage,
    toggleAmountSort,
    openExportModal: () => setIsExportModalOpen(true),
    closeExportModal: () => setIsExportModalOpen(false),
    exportJson
  };
};
