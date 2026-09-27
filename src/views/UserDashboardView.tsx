import React from 'react';
import { useUserDashboardController } from './useUserDashboardController';
import { MDashboardHeader, MDashboardErrorBanner, MDashboardFilters, MDashboardTable, MDashboardExportModal } from '../components/molecules';
import './UserDashboardView.css';

export const UserDashboardView: React.FC = () => {
  const { state, status, actions } = useUserDashboardController();
  return (
    <div className="user-dashboard-view">
      <MDashboardHeader title="Executive Dashboard" onRefresh={actions.reload} onOpenExportModal={actions.openExportModal} />
      <MDashboardErrorBanner authError={status.authError} isRetrying={status.isRetrying} onRetryAuth={actions.reload} />
      <MDashboardFilters filters={state.filters} pageSize={state.pageSize} onCategoryChange={actions.setCategory} onSearchChange={actions.setSearchQuery} onPageSizeChange={actions.setPageSize} />
      <MDashboardTable items={state.visibleItems} isLoading={status.isLoading} sortState={state.sortState} onToggleAmountSort={actions.toggleAmountSort} />
      <MDashboardExportModal isOpen={state.isExportModalOpen} recordCount={state.visibleItems.length} onClose={actions.closeExportModal} onConfirmExport={actions.exportJson} />
    </div>
  );
};
export default UserDashboardView;
