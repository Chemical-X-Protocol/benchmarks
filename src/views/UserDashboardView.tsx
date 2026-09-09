import React from 'react';
import { useUserDashboardController } from './useUserDashboardController';
import { MDashboardHeader, MDashboardErrorBanner, MDashboardFilters, MDashboardTable, MDashboardExportModal } from '../components/molecules';

export const UserDashboardView: React.FC = () => {
  const c = useUserDashboardController();
  return (
    <div style={{ padding: '24px', background: '#0b1329', color: '#e2e8f0', minHeight: '100vh' }}>
      <MDashboardHeader title="Executive Dashboard" onRefresh={c.reload} onOpenExportModal={c.openExportModal} />
      <MDashboardErrorBanner authError={c.authError} isRetrying={c.isRetrying} onRetryAuth={c.reload} />
      <MDashboardFilters filters={c.filters} pageSize={c.pageSize} onCategoryChange={c.setCategory} onSearchChange={c.setSearchQuery} onPageSizeChange={c.setPageSize} />
      <MDashboardTable items={c.visibleItems} isLoading={c.isLoading} sortState={c.sortState} onToggleAmountSort={c.toggleAmountSort} />
      <MDashboardExportModal isOpen={c.isExportModalOpen} recordCount={c.visibleItems.length} onClose={c.closeExportModal} onConfirmExport={c.exportJson} />
    </div>
  );
};
export default UserDashboardView;
